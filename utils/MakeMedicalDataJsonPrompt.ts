import { type Message as ExecutorchMessage } from "react-native-executorch";


const SCHEMAS: Record<string, string> = {
  Prescription: `{
  "patient_name": "",
  "doctor_name": "",
  "clinic_name": "",
  "date": "",
  "medicines": [{ "name": "", "dosage": "", "frequency": "", "duration": "", "timing": "" }],
  "important_notes": [],
  "tags": []
}`,

  "Prescription Receipt": `{
  "patient_name": "",
  "pharmacy_name": "",
  "date": "",
  "medicines": [{ "name": "", "dosage": "", "frequency": "", "duration": "", "timing": "" }],
  "billing_items": [{ "name": "", "price": "" }],
  "total_amount": "",
  "important_notes": [],
  "tags": []
}`,

  "Lab Report": `{
  "patient_name": "",
  "lab_name": "",
  "referred_by": "",
  "date": "",
  "tests": [{ "name": "", "value": "", "unit": "", "normal_range": "", "status": "" }],
  "important_notes": [],
  "tags": []
}`,

  "Radiology Report": `{
  "patient_name": "",
  "referred_by": "",
  "center_name": "",
  "date": "",
  "modality": "",
  "body_part": "",
  "findings": "",
  "impression": "",
  "important_notes": [],
  "tags": []
}`,

  "Medical Bill": `{
  "patient_name": "",
  "hospital_name": "",
  "date": "",
  "billing_items": [{ "name": "", "price": "" }],
  "subtotal": "",
  "discount": "",
  "total_amount": "",
  "important_notes": [],
  "tags": []
}`,

  "Discharge Summary": `{
  "patient_name": "",
  "hospital_name": "",
  "admission_date": "",
  "discharge_date": "",
  "diagnosis": "",
  "procedures": [],
  "medicines": [{ "name": "", "dosage": "", "frequency": "", "duration": "", "timing": "" }],
  "tests": [{ "name": "", "value": "", "unit": "", "normal_range": "", "status": "" }],
  "follow_up": "",
  "important_notes": [],
  "tags": []
}`,

  "Referral Letter": `{
  "patient_name": "",
  "referring_doctor": "",
  "referred_to": "",
  "date": "",
  "reason_for_referral": "",
  "medicines": [{ "name": "", "dosage": "", "frequency": "", "duration": "", "timing": "" }],
  "important_notes": [],
  "tags": []
}`,

  "Insurance Document": `{
  "patient_name": "",
  "insurance_provider": "",
  "policy_number": "",
  "valid_from": "",
  "valid_to": "",
  "coverage_details": [],
  "billing_items": [{ "name": "", "price": "" }],
  "claim_amount": "",
  "important_notes": [],
  "tags": []
}`,

  "Consent Form": `{
  "patient_name": "",
  "doctor_name": "",
  "hospital_name": "",
  "date": "",
  "procedure": "",
  "consent_given": "",
  "important_notes": [],
  "tags": []
}`,

  "Medical History Record": `{
  "patient_name": "",
  "date_of_birth": "",
  "blood_group": "",
  "allergies": [],
  "chronic_conditions": [],
  "past_surgeries": [],
  "medicines": [{ "name": "", "dosage": "", "frequency": "", "duration": "", "timing": "" }],
  "past_tests": [{ "name": "", "value": "", "unit": "", "normal_range": "", "status": "" }],
  "important_notes": [],
  "tags": []
}`,

  Other: `{
  "patient_name": "",
  "date": "",
  "medicines": [{ "name": "", "dosage": "", "frequency": "", "duration": "", "timing": "" }],
  "tests": [{ "name": "", "value": "", "unit": "", "normal_range": "", "status": "" }],
  "billing_items": [{ "name": "", "price": "" }],
  "important_notes": [],
  "tags": []
}`,
};

export async function MakeMedicalDataJsonPrompt(
  ocrText: string,
  docType: string
): Promise<ExecutorchMessage[]> {
  const schema = SCHEMAS[docType] ?? SCHEMAS["Other"];

  return [
    {
      role: "system",
      content: `You are a medical document data extractor.
Extract data from the document and return ONLY valid JSON matching this exact shape:
{
  "title": "",
  "doc_type": "${docType}",
  "document_metadata": ${schema}
}

RULES:
- Return ONLY the JSON object. No markdown, no explanation, no extra text.
- "" for missing text fields. [] for missing list fields.
- Preserve all medical values exactly as written.
- Do NOT hallucinate any field.
- Dates must be in DD-MM-YYYY format. "" if missing.
- title: short human-readable summary under 10 words. Include patient name and date if available.
- Frequency: OD / BD / TDS / QID / SOS / 1-0-1 / 1-1-1 / 0-0-1 etc — use as-is.
- If duration like "x 7d" or "x 15d" appears anywhere, apply to all medicines.`,
    },
    {
      role: "user",
      content: `Medical Document Text: ${ocrText}`,
    },
  ];
}