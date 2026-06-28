import { type Message as ExecutorchMessage } from "react-native-executorch";

export async function finalMedicalclassficationPrompt(
    message: string
): Promise<ExecutorchMessage[]> {
    return [
        {
            role: "system",
            content: `/no_think You are a binary classifier. Is this text medical? Reply ONLY True or False.`,
        },
        {
            role: "user",
            content: message,
        },
        {
            role: "assistant",
            content: ``,
        },
    ];
}