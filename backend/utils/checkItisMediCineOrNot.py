from prompts.checkItisMediCineOrNot import GetPrompt
from services.Checking import Groqclient


async def checkItisMediCineOrNot(text:str):
    try:
        prompt = GetPrompt(text)

        completion = Groqclient.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            temperature=0
        )
        return completion.choices[0].message.content
    
    except Exception as e:
        print(f"Error checking if text is medicine or not: {e}")
        return None