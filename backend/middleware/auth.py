from fastapi import Depends
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from jose import jwt, JWTError
from config import config
from exceptions.custom_exceptions import AppException

security = HTTPBearer()


async def auth(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        token = credentials.credentials

        print("Received token:", token)  # Debugging statement

        payload = jwt.decode(
            token,
            config["SECRET_KEY"],
            algorithms=[config["ALGORITHM"]]
        )

        return payload

    except JWTError:

        raise AppException(
            status_code=401,
            detail="Invalid or expired token"
        )