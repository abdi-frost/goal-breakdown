from typing import Dict, List, Any
import os
from dotenv import load_dotenv

load_dotenv()

# This module exposes a single function `generate_steps(goal: str)` which
# returns a dict: {"steps": [s1..s5], "complexity": int}
# It will try to call Google's Generative AI (Gemini) if configured via
# `GOOGLE_API_KEY` or `GEMINI_API_KEY`. If not available, a simple
# deterministic fallback generator is used so the backend works offline.

def _fallback_generate(goal: str) -> Dict[str, Any]:
    goal_short = goal.strip().rstrip('.')
    steps: List[str] = [
        f"Define the core value proposition and target users for '{goal_short}'.",
        f"Validate demand: run quick customer interviews and gather feedback for '{goal_short}'.",
        f"Create a 1-page plan and minimum viable version for '{goal_short}'.",
        f"Build and launch a first experiment or landing page to collect interest.",
        f"Iterate based on feedback and set measurable milestones for the next 30 days.",
    ]
    # Simple heuristic complexity: longer goals => higher complexity, capped 1-10
    complexity = min(10, max(1, len(goal_short) // 10))
    return {"steps": steps, "complexity": complexity}


def generate_steps(goal: str) -> Dict[str, Any]:
    """Generate 5 actionable steps and a complexity score (1-10) for the goal.

    Preferred: call Google Generative API if configured. Otherwise use fallback.
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_generate(goal)

    try:
        # Lazy import to avoid dependency issues when API key isn't provided
        import google.generativeai as genai

        genai.configure(api_key=api_key)

        prompt = (
            "You are an assistant that turns a vague goal into exactly 5 concise, "
            "actionable sub-tasks and a complexity score from 1-10. Respond with JSON "
            "object with keys: steps (array of 5 strings) and complexity (int).\n"
            f"Goal: {goal}\n\nOutput JSON:"
        )

        # Use the text generation client. This is a lightweight example and may
        # need adjustment depending on the installed version of the library.
        response = genai.generate_text(model="gemini-lite", prompt=prompt, max_output_tokens=512)
        text = getattr(response, "text", None) or response

        import json

        # Try to extract JSON from the response text.
        first_brace = str(text).find('{')
        if first_brace >= 0:
            json_text = str(text)[first_brace:]
            try:
                data = json.loads(json_text)
                # Basic validation
                if isinstance(data.get("steps"), list) and isinstance(data.get("complexity"), int):
                    return {"steps": data["steps"][:5], "complexity": max(1, min(10, data["complexity"]))}
            except Exception:
                pass

        # If parsing failed, fall back to deterministic generator
        return _fallback_generate(goal)

    except Exception:
        return _fallback_generate(goal)


if __name__ == "__main__":
    # quick manual check
    print(generate_steps("Launch a startup"))