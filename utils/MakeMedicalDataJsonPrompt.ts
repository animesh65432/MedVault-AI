import { getStructuredOutputPrompt, Message } from 'react-native-executorch';
import * as z from 'zod/v4';

const MedicineSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
  timing: z.string(),
});

const TestSchema = z.object({
  name: z.string(),
  value: z.string(),
  unit: z.string(),
  normal_range: z.string(),
  status: z.string(),
});

const BillingItemSchema = z.object({
  name: z.string(),
  price: z.string(),
});

const BASE = {
  title: z.string(),
  doc_type: z.string(),
};

const SCHEMAS = {
  Prescription: z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      doctor_name: z.string(),
      clinic_name: z.string(),
      date: z.string(),
      medicines: z.array(MedicineSchema),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  "Lab Report": z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      lab_name: z.string(),
      referred_by: z.string(),
      date: z.string(),
      tests: z.array(TestSchema),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  "Radiology Report": z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      referred_by: z.string(),
      center_name: z.string(),
      date: z.string(),
      modality: z.string(),
      body_part: z.string(),
      findings: z.string(),
      impression: z.string(),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  "Medical Bill": z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      hospital_name: z.string(),
      date: z.string(),
      billing_items: z.array(BillingItemSchema),
      subtotal: z.string(),
      discount: z.string(),
      total_amount: z.string(),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  "Prescription Receipt": z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      pharmacy_name: z.string(),
      date: z.string(),
      medicines: z.array(MedicineSchema),
      billing_items: z.array(BillingItemSchema),
      total_amount: z.string(),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  "Discharge Summary": z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      hospital_name: z.string(),
      admission_date: z.string(),
      discharge_date: z.string(),
      diagnosis: z.string(),
      procedures: z.array(z.string()),
      medicines: z.array(MedicineSchema),
      tests: z.array(TestSchema),
      follow_up: z.string(),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  "Referral Letter": z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      referring_doctor: z.string(),
      referred_to: z.string(),
      date: z.string(),
      reason_for_referral: z.string(),
      medicines: z.array(MedicineSchema),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),

  Other: z.object({
    ...BASE,
    document_metadata: z.object({
      patient_name: z.string(),
      date: z.string(),
      medicines: z.array(MedicineSchema),
      important_notes: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),
};

export type DocType = keyof typeof SCHEMAS;

export function getMedicalSchema(docType: string) {
  return SCHEMAS[docType as DocType] ?? SCHEMAS["Other"];
}

export async function MakeMedicalDataJsonPrompt(
  ocrText: string,
  docType: string
): Promise<Message[]> {
  const schema = getMedicalSchema(docType);
  const structuredOutputPrompt = getStructuredOutputPrompt(schema);
  return [
    {
      role: "system",
      content: `/no_think 
      You are a medical data extractor. 
      Extract data into JSON. Dates: DD-MM-YYYY. 
      Empty string for missing fields.\n\n
      ${structuredOutputPrompt}
      Type: ${docType}
      Text:${ocrText}
      `,
    }
  ];
}