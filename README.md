# VitalLink AI: Full-Stack Smart Volunteer Coordination 🆘

VitalLink AI is a professional matching engine that optimizes volunteer allocation for disaster response using a **Python FastAPI Backend** and a high-performance **Frontend Dashboard**.

## 🏗️ Project Structure
- **/backend**: Python REST API powered by FastAPI.
  - `main.py`: The AI Scoring Engine.
  - `requirements.txt`: Backend dependencies.
- **/frontend**: Modern UI Dashboard.
  - `index.html`, `style.css`, `app.js`.

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The API will run on `http://localhost:8000`.

### 2. Start the Frontend
Open `frontend/index.html` in your browser.

## 🧠 AI Algorithm
The backend implements a **Multi-Criteria Decision Analysis (MCDA)** inspired scoring model:
- **Skill Match (40%)**: Calculated via set-intersection of mission needs and volunteer skills.
- **Location Proximity (30%)**: Distance-based rank.
- **Availability (20%)**: Readiness status.
- **Experience (10%)**: Historical mission completion factor.

---
*Hackathon-Ready Technical Prototype*
