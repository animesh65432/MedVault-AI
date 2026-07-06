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
    title: string;
    time: Date;
    repeat: ReminderRepeat;
};

export interface Medicine {
    name: string;
    dosage: string;
    frequency: "once_daily" | "twice_daily" | "thrice_daily" | "weekly" | "as_needed";
    duration: string;
    timing: [];
    reminders: Reminder[]
}

export interface LabTest {
    name: string;
    value: string;
    unit: string;
    normal_range: string;
    status: string;
}

export interface BillingItem {
    name: string;
    price: string;
}

export interface BaseDocument {
    title: string;
    type: TypeOfDocumenet;
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