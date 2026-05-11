from datetime import datetime, timedelta, timezone
from config import config
from jose import jwt

def create_access_token(data: dict):

    expire = datetime.now(timezone.utc) + timedelta(days=90)

    UpdateData = {
        **data,
        "exp": expire
    }

    encoded_jwt = jwt.encode(
        UpdateData,
        config["SECRET_KEY"],
        algorithm=config["ALGORITHM"]
    )

    return encoded_jwt