from skill_library import skill_library
import re
import numpy as np
from openai import OpenAI

client = OpenAI()

_skill_patterns = {
    skill: re.compile(rf"(?<!\w){re.escape(skill)}(?!\w)", re.IGNORECASE)
    for skill in skill_library
}


def keyword_search(job_text: str, user_skills: list[str]):
    user_skills_lower = [skill.lower() for skill in user_skills]

    found_skills = []
    for skill, pattern in _skill_patterns.items():
        if pattern.search(job_text):
            found_skills.append(skill)

    if not found_skills:
        return {"matched_skills": [], "missing_skills": [], "keyword_match": 0}

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
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def similarity_search(job_text: str, profile_summary: str) -> float:
    job_embedding = get_embedding(job_text)
    profile_embedding = get_embedding(profile_summary)
    return cosine_similarity(job_embedding, profile_embedding)


def generate_explanation(matched_skills: list[str], missing_skills: list[str], semantic_score: float) -> str:
    prompt = f"""Matched skills: {', '.join(matched_skills)}
Missing skills: {', '.join(missing_skills)}
Semantic similarity score: {semantic_score:.2f}/1.0

Write a 2-3 sentence explanation of this candidate's fit for the role.Only use the information provided above.
Do not invent qualifications, experience, or skills."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content