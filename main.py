from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
app = FastAPI(title="VitalLink AI - Matching Engine")
# Intelligent path detection for frontend
# Try to find a directory that contains index.html
possible_paths = [
    os.path.join(os.getcwd(), "frontend"),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend"),
    "/frontend",
    os.getcwd() # Final fallback to root
]
frontend_path = None
for p in possible_paths:
    if os.path.exists(p) and os.path.isdir(p):
        # Double check if index.html is there to be sure
        if os.path.exists(os.path.join(p, "index.html")):
            frontend_path = p
            break
# If still not found, we use current directory as a desperate fallback to avoid crash
if not frontend_path:
    frontend_path = os.getcwd()
class Volunteer(BaseModel):
    id: int
    name: str
    skills: List[str]
    proximity: int  # 0-100
    availability: int # 0-100
    experience: int # 0-100
    bio: str
class MatchRequest(BaseModel):
    volunteers: List[Volunteer]
    needs: List[str]
    weights: dict
# Define API endpoints BEFORE mounting static files to avoid conflicts
@app.post("/match")
def calculate_matches(request: MatchRequest):
    scored_volunteers = []
    
    for v in request.volunteers:
        # Skill Match Logic
        matching_skills = [s for s in v.skills if s in request.needs]
        skill_score = (len(matching_skills) / len(request.needs)) * 100 if request.needs else 0
        
        # Weighted Scoring Algorithm
        total_score = (
            (v.proximity * (request.weights.get("proximity", 25) / 100)) +
            (skill_score * (request.weights.get("skill", 25) / 100)) +
            (v.availability * (request.weights.get("availability", 25) / 100)) +
            (v.experience * (request.weights.get("experience", 25) / 100))
        )
        
        scored_volunteers.append({
            "id": v.id,
            "name": v.name,
            "score": round(total_score),
            "matching_skills": matching_skills,
            "original_data": v
        })
    
    scored_volunteers.sort(key=lambda x: x["score"], reverse=True)
    return scored_volunteers
# Mount the frontend directory last as a catch-all for the UI
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
