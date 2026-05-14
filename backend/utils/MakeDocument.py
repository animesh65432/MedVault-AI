import json
from services.ExplainAI import ExplainGroq
from prompts.make_medical_record import GetPrompt


async def make_medical_record(record_text: str) -> dict:
    try:
        prompt = GetPrompt(record_text)

        completion = ExplainGroq.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        raw = completion.choices[0].message.content.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        return json.loads(raw)

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        raise
    except Exception as e:
        print(f"Error generating medical record: {e}")
        raise