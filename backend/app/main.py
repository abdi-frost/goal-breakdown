from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import ai
from . import models
from .db import engine, Base, get_db
from typing import List
from sqlalchemy import text
import time

Base.metadata.create_all(bind=engine)

# Record start time for uptime reporting
START_TIME = time.time()

app = FastAPI(title="Smart Goal Breaker")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.post("/goals", response_model=models.GoalRead)
def create_goal(payload: models.GoalCreate, db: Session = Depends(get_db)):
	if not payload.goal:
		raise HTTPException(status_code=400, detail="Goal is required")

	# Generate steps via AI module
	result = ai.generate_steps(payload.goal)
	steps = result.get("steps", [])[:5]
	complexity = int(result.get("complexity", 1))

	# Map steps into columns
	goal_obj = models.Goal(
		goal_text=payload.goal,
		step_one=steps[0] if len(steps) > 0 else None,
		step_two=steps[1] if len(steps) > 1 else None,
		step_three=steps[2] if len(steps) > 2 else None,
		step_four=steps[3] if len(steps) > 3 else None,
		step_five=steps[4] if len(steps) > 4 else None,
		complexity=complexity,
		user_id=payload.user_id,
	)

	db.add(goal_obj)
	db.commit()
	db.refresh(goal_obj)
	return goal_obj


@app.get("/goals", response_model=List[models.GoalRead])
def list_goals(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
	items = db.query(models.Goal).order_by(models.Goal.created_at.desc()).offset(skip).limit(limit).all()
	return items


@app.get("/goals/user/{user_id}", response_model=List[models.GoalRead])
def list_goals_by_user(user_id: str, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
	"""Get all goals for a specific user"""
	items = db.query(models.Goal).filter(models.Goal.user_id == user_id).order_by(models.Goal.created_at.desc()).offset(skip).limit(limit).all()
	return items


@app.get("/goals/{goal_id}", response_model=models.GoalRead)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
	"""Get a specific goal by ID"""
	goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
	if not goal:
		raise HTTPException(status_code=404, detail="Goal not found")
	return goal


@app.delete("/goals/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
	"""Delete a specific goal by ID"""
	goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
	if not goal:
		raise HTTPException(status_code=404, detail="Goal not found")
	
	db.delete(goal)
	db.commit()
	return {"message": "Goal deleted successfully", "id": goal_id}


@app.get("/health")
def health(db: Session = Depends(get_db)):
	"""Lightweight health check: returns status, uptime (seconds), and DB connectivity."""
	uptime = int(time.time() - START_TIME)
	db_ok = True
	try:
		# simple no-op query to validate DB connection
		db.execute(text("SELECT 1"))
	except Exception:
		db_ok = False

	status = "ok" if db_ok else "degraded"
	return {"status": status, "uptime_seconds": uptime, "db": db_ok}


if __name__ == "__main__":
	import uvicorn

	uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
