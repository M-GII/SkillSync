from skill_library import skill_library
import re
def keyword_search(job_text: str, user_skills: list[str]):
    job_text_lower = job_text.lower()
    found_skills = []

    for skill in skill_library:
        pattern = rf"(?<!\w){re.escape(skill)}(?!\w)"

        if re.search(pattern, job_text_lower):
            found_skills.append(skill)

    if not found_skills:
        return 0

    matched_skills = []

    for skill in found_skills:
        if skill in user_skills:
            matched_skills.append(skill)

    return len(matched_skills) / len(found_skills)


def similarity_search(job_text: str, user_skills: list[str]):


    return

    
