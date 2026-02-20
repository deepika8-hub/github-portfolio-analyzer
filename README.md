#  GitHub Portfolio Analyzer & Enhancer

Turn GitHub Repositories into Recruiter-Ready Proof.

##  Problem

Most students and early-career developers struggle to understand how recruiters evaluate GitHub profiles.

Common issues:
- Incomplete documentation
- Poor skill signaling
- Inconsistent activity
- No objective scoring system

##  Solution

This tool analyzes a GitHub profile and generates:

-  GitHub Portfolio Score (Out of 100)
-  Engineering Depth Evaluation
-  Impact Measurement
-  Activity Consistency Check
-  Documentation Quality Review
-  Professionalism Assessment
-  Actionable Improvement Suggestions

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- FastAPI (Python)
- GitHub REST API

---

##  Scoring System

| Metric | Weight |
|--------|--------|
| Engineering Depth | 20 |
| Impact | 20 |
| Consistency | 20 |
| Documentation | 20 |
| Professionalism | 20 |

Total Score: 100

---

##  How It Works

1. User enters GitHub profile URL
2. Frontend extracts username
3. Backend fetches GitHub public data
4. System calculates structured score
5. Results displayed instantly

---

##  How to Run Locally

### Backend

cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn requests
uvicorn app.main:app --reload


Backend runs at:

http://127.0.0.1:8000

---

### Frontend

Open:

frontend/index.html

Or use Live Server extension.

---

##  Future Improvements

- Commit history analysis
- Open-source contribution scoring
- NLP-based README evaluation
- LLM-powered recruiter summary

---

Built for UnsaidTalks GitHub Portfolio Analyzer Hackathon 2026

