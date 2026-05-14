from fastapi import APIRouter,UploadFile
from utils.upload_photo import upload_photo
from utils.checkItisMediCineOrNot import checkItisMediCineOrNot
from utils.EXtractText import extract_text_from_image
from utils.MakeDocument import make_medical_record

Docsrouter = APIRouter()

@Docsrouter.post("/generate-pdf")
async def generate_docs(file: UploadFile):
  image_url = await upload_photo(file)
  extracted_text = await extract_text_from_image(image_url)
  is_medical = await checkItisMediCineOrNot(extracted_text)

  if is_medical.strip() != "True":
    return {
        "is_medical": False,
        "message": "The uploaded document does not appear to be a medical record."
    }

  medical_record = await make_medical_record(extracted_text)


  return {"is_medical": is_medical, "medical_record": medical_record}
