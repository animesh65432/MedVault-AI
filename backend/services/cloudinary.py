import boto3
from config import config

s3 = boto3.client(
    service_name="s3",
    endpoint_url=(
        f"https://"
        f"{config['CLOUDFLARE_ACCOUNT_ID']}"
        f".r2.cloudflarestorage.com"
    ),
    aws_access_key_id=config["R2_ACCESS_KEY"],
    aws_secret_access_key=config["R2_SECRET_KEY"],
    region_name="auto"
)
