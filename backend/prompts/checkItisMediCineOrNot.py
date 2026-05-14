def GetPrompt(text: str):
    return f"""
You are a strict medical text classifier.

Determine whether the following text is medically related.

Return ONLY:
True
or
False

Text:
{text}
"""