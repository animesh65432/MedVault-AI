import uuid
from services.cloudflare import s3
from config import config

async def upload_file(file):
    try:
        extension = file.filename.split(".")[-1]

        if file.content_type == "application/pdf":
            filename = f"documents/{uuid.uuid4()}.{extension}"
        else:
            filename = f"photos/{uuid.uuid4()}.{extension}"

        s3.upload_fileobj(
            Fileobj=file.file,
            Bucket=config["R2_BUCKET_NAME"],
            Key=filename,
            ExtraArgs={
                "ContentType": file.content_type
            }
        )
        return f"{config['R2_PUBLIC_URL']}/{filename}"
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None