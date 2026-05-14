import hashlib
from fastapi import APIRouter, Depends,UploadFile
from db.database import async_get_db
from middleware.auth import auth
from utils.upload_photo import upload_photo
from utils.checkItisMediCineOrNot import checkItisMediCineOrNot
from utils.EXtractText import extract_text_from_image
from utils.MakeDocument import make_medical_record
from services.docs import create_document
from utils.generate_embedding import generate_embedding
from db.database import AsyncSession

Docsrouter = APIRouter()

@Docsrouter.post("/generate-pdf")
async def generate_docs(file: UploadFile, db: AsyncSession = Depends(async_get_db), current_user: dict = Depends(auth)):

  content = await file.read()

  file_hash = hashlib.sha256(content).hexdigest()

  file.file.seek(0)

  image_url = await upload_photo(file)

  if not image_url:
    return {
      "success": False,
      "message": "Upload failed"
    }
  
  extracted_text = await extract_text_from_image(image_url)

  if not extracted_text:
    return {
      "success": False,
      "message": "Failed to extract text from image"
    }
  
  is_medical = await checkItisMediCineOrNot(extracted_text)

  if is_medical.strip() != "True":
    return {
        "is_medical": False,
        "message": "The uploaded document does not appear to be a medical record."
    }

  medical_record = await make_medical_record(extracted_text)

  embedding = await generate_embedding(extracted_text)

  # record = await create_document(db, {
  #   "title": medical_record["title"],
  #   "content": extracted_text,
  #   "user_id": current_user["id"],
  #   "file_hash": file_hash,
  #   "source_link": image_url,
  #   "doc_type": medical_record["doc_type"],
  #   "document_metadata": medical_record["document_metadata"],
  #   "embedding": embedding
  # })

  record =  {
    "title": medical_record["title"],
    "content": extracted_text,
    "user_id": current_user["id"],
    "file_hash": file_hash,
    "source_link": image_url,
    "doc_type": medical_record["doc_type"],
    "document_metadata": medical_record["document_metadata"],
    "embedding": embedding
  }

  return {"is_medical": is_medical, "record": record}
