from google.oauth2 import id_token
from google.auth.transport import requests
from config import config

# def verify_google_token(token: str):

#     user_info = id_token.verify_oauth2_token(
#         token,
#         requests.Request(),
#         config["GOOGLE_CLIENT_ID"]
#     )

#     return user_info

def verify_google_token(token: str):

    return {
        "email": "test@gmail.com",
        "name": "Animesh",
        "profile_image": "https://example.com/image.jpg"
    }