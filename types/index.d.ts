export type TypeOfDocumenet =
    | "Prescription"
    | "Prescription Receipt"
    | "Lab Report"
    | "Radiology Report"
    | "Medical Bill"
    | "Discharge Summary"
    | "Referral Letter"
    | "Insurance Document"
    | "Consent Form"
    | "Medical History Record"
    | "Other";

export type ReminderRepeat = "once" | "daily" | "weekly";

export type Reminder = {
    Id?: number;
    MedicineId?: number;
    title: string;
    time: Date;
    repeat: ReminderRepeat;
};

export interface Medicine {
    Id?: number;
    DocumentId?: number;
    name: string;
    dosage: string;
    frequency: "once_daily" | "twice_daily" | "thrice_daily" | "weekly" | "as_needed";
    duration_days: number | null;
    timing: string[];
    reminders: Reminder[];
}

export interface LabTest {
    Id?: number;
    DocumentId?: number;
    name: string;
    value: string;
    unit: string;
    normal_range: string;
    status: string;
}

export interface BillingItem {
    Id?: number;
    DocumentId?: number;
    name: string;
    price: string;
}

export interface BaseDocument {
    title: string;
    type: TypeOfDocumenet;
    risk_level: "Normal" | "High";
}


export interface PrescriptionDocument extends BaseDocument {
    type: "Prescription";
    document_metadata: {
        patient_name: string;
        doctor_name: string;
        clinic_name: string;
        date: string;
        medicines: Medicine[];
        important_notes: string[];
        tags: string[];
    };
}


export interface PrescriptionReceiptDocument extends BaseDocument {
    type: "Prescription Receipt";
    document_metadata: {
        patient_name: string;
        pharmacy_name: string;
        date: string;
        medicines: Medicine[];
        billing_items: BillingItem[];
        total_amount: string;
        important_notes: string[];
        tags: string[];
    };
}

export interface LabReportDocument extends BaseDocument {
    type: "Lab Report";
    document_metadata: {
        patient_name: string;
        lab_name: string;
        referred_by: string;
        date: string;
        tests: LabTest[];
        important_notes: string[];
        tags: string[];
    };
}


export interface RadiologyReportDocument extends BaseDocument {
    type: "Radiology Report";
    document_metadata: {
        patient_name: string;
        referred_by: string;
        center_name: string;
        date: string;
        modality: string;
        body_part: string;
        findings: string;
        impression: string;
        important_notes: string[];
        tags: string[];
    };
}


export interface MedicalBillDocument extends BaseDocument {
    type: "Medical Bill";
    document_metadata: {
        patient_name: string;
        hospital_name: string;
        date: string;
        billing_items: BillingItem[];
        subtotal: string;
        discount: string;
        total_amount: string;
        important_notes: string[];
        tags: string[];
    };
}

export interface DischargeSummaryDocument extends BaseDocument {
    type: "Discharge Summary";
    document_metadata: {
        patient_name: string;
        hospital_name: string;
        admission_date: string;
        discharge_date: string;
        diagnosis: string;
        procedures: string[];
        medicines: Medicine[];
        tests: LabTest[];
        follow_up: string;
        important_notes: string[];
        tags: string[];
        date: string;
    };
}


export interface ReferralLetterDocument extends BaseDocument {
    type: "Referral Letter";
    document_metadata: {
        patient_name: string;
        referring_doctor: string;
        referred_to: string;
        date: string;
        reason_for_referral: string;
        medicines: Medicine[];
        important_notes: string[];
        tags: string[];
    };
}


export interface GenericDocument extends BaseDocument {
    type:
    | "Insurance Document"
    | "Consent Form"
    | "Medical History Record"
    | "Other";
    document_metadata: {
        patient_name: string;
        date: string;
        medicines: Medicine[];
        important_notes: string[];
        tags: string[];
        summary: string;
        key_points: string[];
    };
}

export type DocumentType =
    | PrescriptionDocument
    | PrescriptionReceiptDocument
    | LabReportDocument
    | RadiologyReportDocument
    | MedicalBillDocument
    | DischargeSummaryDocument
    | ReferralLetterDocument
    | GenericDocument;



export type CountTypes = {
    documentsCount: number;
    medicinesCount: number;
    remindersCount: number;
}

export type DocumentRow = {
    key_points: string[];
    procedures: string[];
    tests: LabTest[];
    billing_items: BillingItem[];
    medicines: Medicine[];
    notes: string[];
    tags: string[];
    Id: number;
    Hash: string;
    SourceFilePath: string;
    CreatedAt: string;
    UpdatedAt: string;
    title: string;
    type: TypeOfDocumenet;
    date: string | null;
    patient_name: string | null;
    doctor_name: string | null;
    clinic_name: string | null;
    pharmacy_name: string | null;
    lab_name: string | null;
    referred_by: string | null;
    center_name: string | null;
    modality: string | null;
    body_part: string | null;
    findings: string | null;
    impression: string | null;
    hospital_name: string | null;
    admission_date: string | null;
    discharge_date: string | null;
    diagnosis: string | null;
    follow_up: string | null;
    referring_doctor: string | null;
    referred_to: string | null;
    reason_for_referral: string | null;
    subtotal: string | null;
    discount: string | null;
    total_amount: string | null;
    summary: string | null;
    IsPdf: boolean;
}

export type SearchSuggestion = {
    documentId: number
    title: string
    field: string
    snippet: string
    date: string | null,
    type: TypeOfDocumenet,
    SourceFilePath: string,
    IsPdf: boolean
}

type SourceConfig = {
    ftsTable: string
    baseTable: string
    label: string
    snippetCol: number
    directDocId: boolean
}

interface UploadedBase {
    Id: number;
    Hash: string;
    SourceFilePath: string;
    CreatedAt: string;
    UpdatedAt: string;
    IsPdf: boolean;
    title: string;
    date: string | null;
    patient_name: string | null;
    tags: string[];
    notes: string[];
}

export interface UploadedPrescriptionDocument extends UploadedBase {
    type: "Prescription";
    doctor_name: string | null;
    clinic_name: string | null;
    medicines: Medicine[];
}

export interface UploadedPrescriptionReceiptDocument extends UploadedBase {
    type: "Prescription Receipt";
    pharmacy_name: string | null;
    total_amount: string | null;
    medicines: Medicine[];
    billing_items: BillingItem[];
}

export interface UploadedLabReportDocument extends UploadedBase {
    type: "Lab Report";
    lab_name: string | null;
    referred_by: string | null;
    tests: LabTest[];
}

export interface UploadedRadiologyReportDocument extends UploadedBase {
    type: "Radiology Report";
    referred_by: string | null;
    center_name: string | null;
    modality: string | null;
    body_part: string | null;
    findings: string | null;
    impression: string | null;
}

export interface UploadedMedicalBillDocument extends UploadedBase {
    type: "Medical Bill";
    hospital_name: string | null;
    subtotal: string | null;
    discount: string | null;
    total_amount: string | null;
    billing_items: BillingItem[];
}

export interface UploadedDischargeSummaryDocument extends UploadedBase {
    type: "Discharge Summary";
    hospital_name: string | null;
    admission_date: string | null;
    discharge_date: string | null;
    diagnosis: string | null;
    follow_up: string | null;
    procedures: string[];
    medicines: Medicine[];
    tests: LabTest[];
}

export interface UploadedReferralLetterDocument extends UploadedBase {
    type: "Referral Letter";
    doctor_name: string | null;
    referred_to: string | null;
    reason_for_referral: string | null;
    medicines: Medicine[];
}

export interface UploadedGenericDocument extends UploadedBase {
    type: "Insurance Document" | "Consent Form" | "Medical History Record" | "Other";
    summary: string | null;
    key_points: string[];
    medicines: Medicine[];
}

export type UploadedDocument =
    | UploadedPrescriptionDocument
    | UploadedPrescriptionReceiptDocument
    | UploadedLabReportDocument
    | UploadedRadiologyReportDocument
    | UploadedMedicalBillDocument
    | UploadedDischargeSummaryDocument
    | UploadedReferralLetterDocument
    | UploadedGenericDocument;

export type ChatType = "GENERAL_AI" | "CURRENT_DOCUMENT" | "DATABASE_QUERY"

type SourcesTypes = {
    IsPdf: boolean,
    SourceFilePath: string,
}

export type ChatMessage = {
    Id: number;
    UserMessage: string,
    AIResponse: string,
    ShowMore: boolean,
    TableName: string | null,
    Types: TypeOfDocumenet[] | null,
    Soucres: SourcesTypes[] | null,
    CreatedAt: string,
}

export type ChatMessagePayload = {
    "role": "user" | "assistant",
    "content": string,
}


export interface MedicineWithDetailsTypes {
    Id: number;
    name: string;
    dosage: string | null;
    frequency: string | null;
    duration_days: number | null;
    prescribedDate: string;
    doctorName: string | null;
    clinicName: string | null;
    iconColor?: string;
    tags?: MedicineTag[];
    courseLabel?: string;
    DocumentId?: number;
    timing: string[];
}

export interface MedicineTag {
    label: string;
    icon: "sun" | "moon" | "utensils" | "coffee";
    tone?: "accent" | "neutral";
}

export type MedicinesTab = "Documents" | "all";

export type AddMedicineTypes = {
    name: string;
    dosage: string | null;
    frequency: string | null;
    duration: string | null;
    DocumentId?: number;
    timing: string[];
}

export type ReminderWithMedicine = {
    Id: number
    MedicineId: number
    title: string
    time: string
    repeat: string
    medicineName: string
    dosage: string | null
    frequency: string | null
    IsEnabled: boolean
}

export type AlertMedicineDetails = {
    Id: number;
    name: string;
    dosage: string | null;
    frequency: string | null;
    duration_days: number | null;
    DocumentId: number | null;
    doctor_name: string | null;
    date: string | null;
    notes: string[];
    reminder: MedicineReminder;
    isPdf: boolean;
    source: string;
};

export type MedicineReminder = {
    Id: number;
    title: string;
    time: string;
    IsEnabled: boolean;
    repeat: string;
    MedicineId: number;
};
