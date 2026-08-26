from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel

from skill_matcher import keyword_search, similarity_search, generate_explanation

app = FastAPI()


class AnalyzeRequest(BaseModel):
    job_text: str
    user_skills: list[str]
    profile_summary: str


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    keyword_result = keyword_search(req.job_text, req.user_skills)
    semantic_score = similarity_search(req.job_text, req.profile_summary)
    explanation = generate_explanation(
        keyword_result["matched_skills"],
        keyword_result["missing_skills"],
        semantic_score,
    )

    return {
        **keyword_result,
        "semantic_score": semantic_score,
        "explanation": explanation,
    }