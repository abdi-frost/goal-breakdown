from sqlalchemy import Column, Integer, String, Text, DateTime, func
from .db import Base
from pydantic import BaseModel, Field
from typing import Optional, List
import datetime


class Goal(Base):
	__tablename__ = "goals"

	id = Column(Integer, primary_key=True, index=True)
	goal_text = Column(Text, nullable=False)
	step_one = Column(Text, nullable=True)
	step_two = Column(Text, nullable=True)
	step_three = Column(Text, nullable=True)
	step_four = Column(Text, nullable=True)
	step_five = Column(Text, nullable=True)
	complexity = Column(Integer, nullable=False, default=1)
	user_id = Column(String(128), nullable=True)
	created_at = Column(DateTime(timezone=True), server_default=func.now())


class GoalCreate(BaseModel):
	goal: str = Field(..., min_length=1)
	user_id: Optional[str] = None


class GoalRead(BaseModel):
	id: int
	goal_text: str
	step_one: Optional[str]
	step_two: Optional[str]
	step_three: Optional[str]
	step_four: Optional[str]
	step_five: Optional[str]
	complexity: int
	user_id: Optional[str]
	created_at: datetime.datetime

	class Config:
		orm_mode = True


class AIGenerationResult(BaseModel):
	steps: List[str]
	complexity: int
