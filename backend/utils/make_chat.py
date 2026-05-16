from services.Chat import Chatgroq
from prompts.generate_chat_response import GetPrompt


async def generate_chat_response_stream(
    query: str,
    context: str
):
    try:

        prompt = GetPrompt(query, context)

        stream = Chatgroq.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            stream=True
        )

        for chunk in stream:

            delta = chunk.choices[0].delta.content

            if delta:
                yield delta

    except Exception as e:
        print(f"Streaming Error: {e}")

        yield "Sorry, I could not generate a response."