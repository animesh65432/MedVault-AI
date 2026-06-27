import { type Message as ExecutorchMessage } from "react-native-executorch";

export async function makeClassifyMedicalPrompt(
    ocrText: string
): Promise<ExecutorchMessage[]> {
    return [
        {
            role: "system",
            content: `You are a medical document classifier.
Read the document and return ONLY one of these exact strings — nothing else:
Prescription
Prescription Receipt
Lab Report
Radiology Report
Medical Bill
Discharge Summary
Referral Letter
Insurance Document
Consent Form
Medical History Record
Other

RULES:
- Return exactly one string from the list above.
- No punctuation, no explanation, no extra text.
- A document with "H/o" (History of) and medicines + doctor name = Prescription, NOT Medical History Record.
- If unsure, return Other.
-/no think

`,
        },
        {
            role: "user",
            content: `Medical Document Text: ${ocrText}`,
        },
    ];
}