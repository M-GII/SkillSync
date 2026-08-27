from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from skill_matcher import keyword_search, similarity_search, generate_explanation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[" http://localhost:3000", "https://skill-sync-gules-six.vercel.app" ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            keyword_result["keyword_match"],
            semantic_score
        )

        overall_match = keyword_result["keyword_match"] * 0.9 + semantic_score * 0.1

        return {
            **keyword_result,
            "semantic_score": semantic_score,
            "overall_match": overall_match,
            "explanation": explanation,
        }