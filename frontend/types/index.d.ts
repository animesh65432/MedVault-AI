export type DocumentType =
    | "Prescription"
    | "Prescription Receipt"
    | "Lab Report"
    | "Radiology Report"
    | "Medical Bill"
    | "Discharge Summary"
    | "Insurance Document"
    | "Medical History Record"
    | "Referral Letter"
    | "Consent Form"
    | "Other";

export interface Medicine {
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    timing?: string;
}

export interface Test {
    name: string;
    value?: string;
    unit?: string;
    normal_range?: string;
    status?: string;
}

export interface BillingItem {
    name: string;
    price?: string;
}

export interface DocumentMetadata {
    patient_name?: string;

    doctor_name?: string;
    clinic_name?: string;
    hospital_name?: string;
    pharmacy_name?: string;
    lab_name?: string;
    center_name?: string;

    referred_by?: string;
    referring_doctor?: string;
    referred_to?: string;

    date?: string;
    admission_date?: string;
    discharge_date?: string;

    diagnosis?: string;

    modality?: string;
    body_part?: string;

    findings?: string;
    impression?: string;

    procedure?: string;

    medicines?: Medicine[];
    current_medicines?: Medicine[];

    tests?: Test[];
    past_tests?: Test[];

    billing_items?: BillingItem[];

    procedures?: string[];

    allergies?: string[];
    chronic_conditions?: string[];

    subtotal?: string;
    discount?: string;
    total_amount?: string;
    claim_amount?: string;

    insurance_provider?: string;
    policy_number?: string;

    follow_up?: string;

    consent_given?: string;

    important_notes?: string[];
    tags?: string[];
}

export interface Medicine {
    id: number;
    name: string;
}

export interface MedicalDocument {
    id: number;
    title: string;
    content: string;
    doc_type: DocumentType;
    source_link: string;
    document_metadata: DocumentMetadata;
    created_at: string;
    user_id: number;
    date: string;
    medications: Medicine[];
}

export interface StatsInformation {
    total_documents: number;
    total_medicine_records: number;
    total_reminders: number;
}

export interface MedicineRecord {
    dosage: string,
    frequency: string,
    id: number,
    name: string,
    duration: string,
}