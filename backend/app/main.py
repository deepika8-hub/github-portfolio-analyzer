from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from datetime import datetime

app = FastAPI(title="GitHub Portfolio Analyzer API")

# ✅ CORS (IMPORTANT FOR GITHUB PAGES)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileRequest(BaseModel):
    username: str


@app.get("/")
def root():
    return {"status": "API is running"}


@app.post("/analyze")
def analyze_profile(request: ProfileRequest):

    username = request.username.strip()

    headers = {
        "Accept": "application/vnd.github+json"
    }

    profile_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"

    profile_response = requests.get(profile_url, headers=headers)
    repos_response = requests.get(repos_url, headers=headers)

    if profile_response.status_code != 200:
        return {"error": "GitHub user not found"}

    profile = profile_response.json()
    repos = repos_response.json()

    followers = profile.get("followers", 0)
    public_repos = profile.get("public_repos", 0)
    bio = profile.get("bio")

    total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
    total_forks = sum(repo.get("forks_count", 0) for repo in repos)

    # 🔹 Engineering Depth
    depth_score = min(public_repos * 2, 20)

    # 🔹 Impact
    impact_score = min((total_stars + total_forks) * 2, 20)

    # 🔹 Consistency (updated within last 6 months)
    recent_repos = []
    for repo in repos:
        updated = repo.get("updated_at")
        if updated:
            last_update = datetime.strptime(updated, "%Y-%m-%dT%H:%M:%SZ")
            if (datetime.utcnow() - last_update).days < 180:
                recent_repos.append(repo)

    consistency_score = min(len(recent_repos) * 3, 20)

    # 🔹 Documentation
    documented = sum(1 for repo in repos if repo.get("description"))
    documentation_score = min(documented * 2, 20)

    # 🔹 Professionalism
    professionalism_score = 20 if bio else 5

    overall_score = (
        depth_score +
        impact_score +
        consistency_score +
        documentation_score +
        professionalism_score
    )

    # Recruiter-style recommendations
    recommendations = []

    if public_repos < 3:
        recommendations.append("Build at least 3 strong projects.")
    if total_stars < 5:
        recommendations.append("Improve project quality to gain stars.")
    if len(recent_repos) < 2:
        recommendations.append("Maintain consistent GitHub activity.")
    if not bio:
        recommendations.append("Add a professional GitHub bio.")
    if documented < 3:
        recommendations.append("Improve README documentation.")

    return {
        "username": username,
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
        "recommendations": recommendations
    }