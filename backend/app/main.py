from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from datetime import datetime

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileRequest(BaseModel):
    username: str


@app.post("/analyze")
def analyze_profile(request: ProfileRequest):

    username = request.username

    profile_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"

    profile_response = requests.get(profile_url)
    repos_response = requests.get(repos_url)

    if profile_response.status_code != 200:
        return {"error": "User not found"}

    profile = profile_response.json()
    repos = repos_response.json()

    followers = profile.get("followers", 0)
    public_repos = profile.get("public_repos", 0)

    total_stars = sum(repo["stargazers_count"] for repo in repos)
    total_forks = sum(repo["forks_count"] for repo in repos)

    # Basic scoring
    depth_score = min(public_repos * 2, 20)
    impact_score = min((total_stars + total_forks) * 2, 20)

    recent_repos = [
        repo for repo in repos
        if (datetime.now() - datetime.strptime(repo["updated_at"], "%Y-%m-%dT%H:%M:%SZ")).days < 180
    ]
    consistency_score = min(len(recent_repos) * 3, 20)

    documented = sum(1 for repo in repos if repo.get("description"))
    documentation_score = min(documented * 2, 20)

    professionalism_score = 20 if profile.get("bio") else 5

    overall_score = (
        depth_score
        + impact_score
        + consistency_score
        + documentation_score
        + professionalism_score
    )

    return {
    "followers": followers,
    "public_repos": public_repos,
    "scores": {
        "engineering_depth": depth_score,
        "impact": impact_score,
        "consistency": consistency_score,
        "documentation": documentation_score,
        "professionalism": professionalism_score,
        "overall_score": overall_score
    },
    "recommendations": [
        "Increase repository count to show engineering depth.",
        "Add detailed README files with setup and architecture explanation.",
        "Maintain consistent weekly commits to improve activity score."
    ]
    }