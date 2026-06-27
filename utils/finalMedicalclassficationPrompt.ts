import { type Message as ExecutorchMessage } from "react-native-executorch";


export async function finalMedicalclassficationPrompt(message: string): Promise<ExecutorchMessage[]> {
    return [
        {
            role: "system",
            content: `
          You are a binary classifier.
          
          Task:
          Determine whether the given text is related to healthcare, medicine, hospitals, doctors, patients, prescriptions, lab reports, diagnostics, insurance claims, medical forms, or public health.
          
          Rules:
          - Output exactly one word.
          - Output only:
          True
          or
          False
          - Do not explain.
          - Do not think aloud.
          - Do not include punctuation.
          /no_think
          `
        },
        {
            role: "user",
            content: message
        },
    ];
}