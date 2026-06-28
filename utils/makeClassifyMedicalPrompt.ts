import { type Message as ExecutorchMessage } from "react-native-executorch";

export async function makeClassifyMedicalPrompt(
    ocrText: string
): Promise<ExecutorchMessage[]> {
    return [
        {
            role: "system",
            content: `/no_think Classify the medical document. Reply with ONLY one of:
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
Other`,
        },
        {
            role: "user",
            content: `DOCUMENT:\n${ocrText}`,
        },
        {
            role: "assistant",
            content: ``,
        },
    ];
}