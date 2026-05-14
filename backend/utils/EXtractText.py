from services.Groq import Groqclient

async def extract_text_from_image(image_url: str) -> str:
    try:
        completion = Groqclient.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": "You are an OCR and text extraction engine."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
                        },
                        {
                            "type": "text",
                            "text": "Extract clean structured text from this image."
                        }
                    ]
                }
            ],
            temperature=0
        )
        return completion.choices[0].message.content

    except Exception as e:
        print(f"Error extracting text from image: {e}")
        raise 