def VerifyUserCreatePayload(email: str, name: str, profile_image: str):

    if not email or not name or not profile_image:
        return None
    
    return {
        "email": email,
        "name": name,
        "profile_image": profile_image
    }
