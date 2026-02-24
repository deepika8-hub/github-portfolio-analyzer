from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from datetime import datetime
import os

app = FastAPI(title="GitHub Recruiter Simulator API")

# ------------------ CORS ------------------ #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ ENV TOKEN ------------------ #
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

class ProfileRequest(BaseModel):
    username: str

@app.get("/")
def root():
    return {"status": "GitHub Recruiter Simulator API running"}

@app.post("/analyze")
def analyze_profile(request: ProfileRequest):

    username = request.username.strip()

    headers = {
        "Accept": "application/vnd.github+json"
    }

    # 🔥 Use token if available (fixes rate limit)
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    profile_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"

    profile_response = requests.get(profile_url, headers=headers)
    repos_response = requests.get(repos_url, headers=headers)

    if profile_response.status_code == 404:
        return {"error": "GitHub user not found"}

    if profile_response.status_code == 403:
        return {"error": "GitHub API rate limit exceeded. Try again later."}

    if profile_response.status_code != 200:
        return {"error": f"GitHub API error: {profile_response.status_code}"}

    profile = profile_response.json()
    repos = repos_response.json()

    followers = profile.get("followers", 0)
    public_repos = profile.get("public_repos", 0)
    bio = profile.get("bio")

    total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
    total_forks = sum(repo.get("forks_count", 0) for repo in repos)

    # ------------------ SCORING ------------------ #

    depth_score = min(public_repos * 2, 20)
    impact_score = min((total_stars + total_forks) * 2, 20)

    recent_repos = []
    for repo in repos:
        updated = repo.get("updated_at")
        if updated:
            last_update = datetime.strptime(updated, "%Y-%m-%dT%H:%M:%SZ")
            if (datetime.utcnow() - last_update).days < 180:
                recent_repos.append(repo)

    consistency_score = min(len(recent_repos) * 3, 20)
    documentation_score = min(
        sum(1 for repo in repos if repo.get("description")) * 2,
        20
    )

    professionalism_score = 20 if bio else 5

    overall_score = (
        depth_score +
        impact_score +
        consistency_score +
        documentation_score +
        professionalism_score
    )

    # ------------------ TIER ------------------ #

    if overall_score >= 80:
        tier = "Elite Engineer"
    elif overall_score >= 60:
        tier = "Strong Profile"
    elif overall_score >= 40:
        tier = "Growing Developer"
    else:
        tier = "Beginner Level"

    # ------------------ SIGNALS ------------------ #

    strong_signals = []
    red_flags = []

    if public_repos >= 5:
        strong_signals.append("Multiple public repositories")
    else:
        red_flags.append("Very few public repositories")

    if total_stars >= 10:
        strong_signals.append("Projects gaining community attention")
    else:
        red_flags.append("Low project visibility")

    if len(recent_repos) >= 3:
        strong_signals.append("Consistent recent activity")
    else:
        red_flags.append("Inconsistent activity")

    if bio:
        strong_signals.append("Professional bio present")
    else:
        red_flags.append("Missing professional bio")

    summary = f"""
{username} is categorized as '{tier}' with an overall portfolio score of {overall_score}/100.
The profile shows {public_repos} public repositories and {followers} followers.
"""

    return {
        "username": username,
        "tier": tier,
        "followers": followers,
        "public_repos": public_repos,
        "total_stars": total_stars,
        "total_forks": total_forks,
        "scores": {
            "engineering_depth": depth_score,
            "impact": impact_score,
            "consistency": consistency_score,
            "documentation": documentation_score,
            "professionalism": professionalism_score,
            "overall_score": overall_score
        },
        "strong_signals": strong_signals,
        "red_flags": red_flags,
        "summary": summary.strip()
    }