from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import ai
from . import models
from .db import engine, Base, get_db
from typing import List

Base.metadata.create_all(bind=engine)

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


if __name__ == "__main__":
	import uvicorn

	uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
