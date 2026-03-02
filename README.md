#  GitHub Recruiter Intelligence  
### AI-Powered GitHub Portfolio Analyzer & Enhancer  

Turn GitHub repositories into recruiter-ready proof.

---

##  Problem Statement

For students and early-career developers, GitHub acts as a primary portfolio.

However, most profiles fail to clearly communicate:

- Engineering depth  
- Consistency  
- Real-world impact  
- Documentation quality  
- Professional readiness  

Recruiters often spend less than 2 minutes reviewing a profile.  
Without structured signals, strong candidates get overlooked.

---

##  Solution

GitHub Recruiter Intelligence is an AI-powered evaluation system that:

- Accepts a GitHub profile URL
- Analyzes public repositories & activity
- Generates a structured GitHub Portfolio Score (0–100)
- Highlights strong signals
- Identifies red flags
- Provides actionable improvement insights
- Simulates recruiter-style evaluation logic

The goal is to help developers understand how hiring managers interpret GitHub profiles.

---

##  Scoring Framework

| Metric | Max Score | What It Measures |
|--------|-----------|------------------|
| Engineering Depth | 20 | Number & structure of repositories |
| Impact | 20 | Stars, forks, community engagement |
| Consistency | 20 | Recent activity patterns |
| Documentation | 20 | Repository descriptions & clarity |
| Professionalism | 20 | Bio presence & profile completeness |

**Total Score: 100**

---

##  Output Includes

-  Overall Portfolio Score (0–100)
-  Tier Classification (Elite / Strong / Growing / Beginner)
-  Strong Signals
-  Red Flags
-  Top Repositories
-  Recruiter Summary
-  Score Breakdown Visualization

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- GitHub Pages (Hosting)

### Backend
- FastAPI (Python)
- GitHub REST API
- Render (Deployment)
- GitHub Token Authentication

---

##  Live Demo

Frontend (GitHub Pages):  
https://deepika8-hub.github.io/github-portfolio-analyzer/

Backend (Render API):  
https://github-portfolio-analyzer-8ab1.onrender.com 

---

##  How It Works

1. User enters GitHub username or URL  
2. Frontend extracts username  
3. Backend fetches GitHub public API data  
4. Scoring engine evaluates structured signals  
5. Recruiter-style output is generated  
6. Results displayed instantly  

Average analysis time: **Under 2 minutes**

---

##  How to Run Locally

### Backend

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs at:
http://127.0.0.1:8000

Frontend

Open:

frontend/index.html

Or use Live Server extension.



Environment Variable


To prevent GitHub API rate limits, configure:

GITHUB_TOKEN = your_personal_access_token

Add this in Render → Environment → Variables.





Evaluation Alignment


Impact → Structured evaluation in under 2 minutes

Innovation → Recruiter-style scoring logic

Technical Execution → Full-stack deployed architecture

User Experience → Clean UI with clear signal breakdown

Presentation → Live deployed solution with demo


