import uuid
from services.cloudinary import s3
from config import config

async def upload_photo(file):
    try:
        extension = file.filename.split(".")[-1]
        filename = (
            f"photos/{uuid.uuid4()}.{extension}"
        )
        s3.upload_fileobj(
            Fileobj=file.file,
            Bucket=config["R2_BUCKET_NAME"],
            Key=filename,
            ExtraArgs={
                "ContentType": file.content_type
            }
        )
        image_url = (
            f"{config['R2_PUBLIC_URL']}/{filename}"
        )
        return image_url
    except Exception as e:
        print(f"Error uploading photo: {e}")
        return None