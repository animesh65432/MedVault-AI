def build_embedding_text(medical_record: dict) -> str:
    title    = medical_record.get("title", "")
    doc_type = medical_record.get("doc_type", "")
    metadata = medical_record.get("document_metadata", {})

    parts = [
        title,
        doc_type,
        metadata.get("patient_name", ""),
        metadata.get("date", ""),
    ]

    if doc_type in ("Test Report", "Lab Report", "Pathology Report"):
        parts.append(metadata.get("lab_name", ""))
        parts.append(metadata.get("referred_by", ""))
        for test in metadata.get("tests", []):
            name         = test.get("name", "")
            value        = test.get("value", "")
            normal_range = test.get("normal_range", "")
            try:
                val       = float(value.split()[0])
                low, high = map(float, normal_range.split("-"))
                abnormal  = val < low or val > high
            except:
                abnormal  = True
            if abnormal:
                parts.append(f"{name} {value}".strip())

    elif doc_type == "Prescription":
        parts.append(metadata.get("doctor_name", ""))
        parts.append(metadata.get("clinic_name", ""))
        for med in metadata.get("medicines", []):
            parts.append(med.get("name", ""))

    elif doc_type == "Radiology Report":
        parts.append(metadata.get("center_name", ""))
        parts.append(metadata.get("modality", ""))
        parts.append(metadata.get("body_part", ""))
        parts.append(metadata.get("findings", ""))
        parts.append(metadata.get("impression", ""))

    elif doc_type == "Discharge Summary":
        parts.append(metadata.get("hospital_name", ""))
        parts.append(metadata.get("diagnosis", ""))
        parts.append(metadata.get("follow_up", ""))
        for proc in metadata.get("procedures", []):
            parts.append(proc)
        for med in metadata.get("medicines", []):
            parts.append(med.get("name", ""))

    elif doc_type == "Medical History Record":
        for condition in metadata.get("chronic_conditions", []):
            parts.append(condition)
        for allergy in metadata.get("allergies", []):
            parts.append(allergy)
        for surgery in metadata.get("past_surgeries", []):
            parts.append(surgery)
        for med in metadata.get("current_medicines", []):
            parts.append(med.get("name", ""))

    elif doc_type == "Referral Letter":
        parts.append(metadata.get("referring_doctor", ""))
        parts.append(metadata.get("referred_to", ""))
        parts.append(metadata.get("reason_for_referral", ""))

    elif doc_type == "Medical Bill":
        parts.append(metadata.get("hospital_name", ""))
        parts.append(metadata.get("total_amount", ""))
        for item in metadata.get("billing_items", []):
            parts.append(item.get("name", ""))

    elif doc_type == "Prescription Receipt":
        parts.append(metadata.get("pharmacy_name", ""))
        for med in metadata.get("medicines", []):
            parts.append(med.get("name", ""))

    elif doc_type == "Insurance Document":
        parts.append(metadata.get("insurance_provider", ""))
        parts.append(metadata.get("policy_number", ""))
        parts.append(metadata.get("claim_amount", ""))

    elif doc_type == "Consent Form":
        parts.append(metadata.get("doctor_name", ""))
        parts.append(metadata.get("hospital_name", ""))
        parts.append(metadata.get("procedure", ""))

    elif doc_type == "Other":
        for med in metadata.get("medicines", []):
            parts.append(med.get("name", ""))
        for test in metadata.get("tests", []):
            parts.append(test.get("name", ""))

    for tag in metadata.get("tags", []):
        parts.append(tag)
    for note in metadata.get("important_notes", []):
        parts.append(note)

    return " | ".join([p.strip() for p in parts if p and p.strip()])