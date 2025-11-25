from typing import Dict, List, Any
import os
from dotenv import load_dotenv

load_dotenv()

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
    api_key = os.getenv("GEMINI_API_KEY") or 'GEMINI_API_KEY_NOT_FOUND'
    if not api_key:
        print("Api key not found, using fallback generator.")
        return _fallback_generate(goal)

    try:
        # Lazy import to avoid dependency issues when API key isn't provided
        from google import genai
        import json

        client = genai.Client(api_key=api_key)

        prompt = (
            "You are an assistant that turns a vague goal into exactly 5 concise, "
            "actionable sub-tasks and a complexity score from 1-10. Respond ONLY with a JSON "
            "object with keys: steps (array of 5 strings) and complexity (int). No markdown, no explanation.\n\n"
            f"Goal: {goal}\n\nJSON:"
        )

        # Generate content using the new API
        response =  client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )   
        
        text = response.text.strip()
        
        # debug
        print(f"Gemini response text: {text}")

        # Try to extract JSON from the response text.
        # Remove markdown code blocks if present
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()

        first_brace = text.find('{')
        if first_brace >= 0:
            json_text = text[first_brace:]
            last_brace = json_text.rfind('}')
            if last_brace >= 0:
                json_text = json_text[:last_brace + 1]
            
            try:
                data = json.loads(json_text)
                # Basic validation
                if isinstance(data.get("steps"), list) and isinstance(data.get("complexity"), (int, float)):
                    steps = data["steps"][:5]
                    # Ensure we have exactly 5 steps
                    while len(steps) < 5:
                        steps.append(f"Additional action for: {goal}")
                    complexity = max(1, min(10, int(data["complexity"])))
                    return {"steps": steps, "complexity": complexity}
            except Exception:
                pass

        # If parsing failed, fall back to deterministic generator
        return _fallback_generate(goal)

    except Exception as e:
        print(f"Error generating with Gemini: {e}")
        return _fallback_generate(goal)


if __name__ == "__main__":
    # quick manual check
    print(generate_steps("Launch a startup"))