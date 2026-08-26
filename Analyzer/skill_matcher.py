from skill_library import skill_library
import re
import numpy as np
from openai import OpenAI

client = OpenAI()

_skill_patterns = []

for skill in skill_library:
    for alias in skill["aliases"]:
        _skill_patterns.append({
            "name": skill["name"],
            "alias": alias,
            "pattern": re.compile(rf"(?<!\w){re.escape(alias.lower())}(?!\w)")
        })

_skill_patterns.sort(key=lambda skill: len(skill["alias"]), reverse=True)


def normalize_user_skills(user_skills: list[str]):
    normalized_skills = []

    for user_skill in user_skills:
        user_skill_lower = user_skill.lower()

        for skill in skill_library:
            aliases_lower = [alias.lower() for alias in skill["aliases"]]

            if user_skill_lower in aliases_lower:
                normalized_skills.append(skill["name"].lower())
                break

    return normalized_skills


def keyword_search(job_text: str, user_skills: list[str]):

    job_text_lower = job_text.lower()
    user_skills_lower = normalize_user_skills(user_skills)

    found_skills = []

    for skill in _skill_patterns:
        if skill["pattern"].search(job_text_lower):
            if skill["name"] not in found_skills:
                found_skills.append(skill["name"])

    if not found_skills:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "keyword_match": 0
        }

    matched_skills = []
    missing_skills = []

    for skill in found_skills:
        if skill.lower() in user_skills_lower:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    keyword_match = len(matched_skills) / len(found_skills)

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "keyword_match": keyword_match,
    }


def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )

    return response.data[0].embedding


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)

    return float(
        np.dot(a, b) /
        (np.linalg.norm(a) * np.linalg.norm(b))
    )


def normalize_similarity(raw_score: float, floor: float = 0.05, ceiling: float = 0.45) -> float:
    clamped = max(floor, min(ceiling, raw_score))

    return (clamped - floor) / (ceiling - floor)


def similarity_search(job_text: str, profile_summary: str) -> float:

    job_embedding = get_embedding(job_text)
    profile_embedding = get_embedding(profile_summary)

    raw_score = cosine_similarity(job_embedding, profile_embedding)

    return normalize_similarity(raw_score)


def generate_explanation(
    matched_skills: list[str],
    missing_skills: list[str],
    keyword_score: float,
    semantic_score: float
) -> str:

    prompt = f"""Matched skills: {', '.join(matched_skills)}
Missing skills: {', '.join(missing_skills)}
Keyword match score: {keyword_score:.2f}/1.0
Semantic similarity score: {semantic_score:.2f}/1.0

Write a concise 2-3 sentence assessment directly to the candidate using "you" and "your."

Treat keyword match as the primary indicator of fit.
Treat semantic similarity as secondary supporting context only.

Use these guidelines:
- If keyword match is 0.75 or higher, describe the candidate as having strong or solid skill alignment.
- If keyword match is between 0.50 and 0.74, describe the candidate as a moderate match.
- If keyword match is below 0.50, describe the candidate as a weak match.
- Never describe the candidate as a weak match when keyword match is 0.75 or higher.
- Missing skills should be presented as areas that could improve alignment, not as proof that the candidate is unqualified.

Do not invent qualifications, experience, or skills.
Base the assessment only on the provided data.

End with one practical suggestion for improving alignment, preferably a small project idea or skill to practice based on the most important missing skills.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content or ""