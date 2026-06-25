import { GetPrompt } from "@/prompts/CheckTextClassifier";

export const CheckMedicalClassification = async (
    llm: any,
    text: string
): Promise<boolean> => {
    try {
        if (!text?.trim()) throw new Error("No text provided for classification.");

        const cleanedText = text
            .replace(/(?:-\s*O\s*){3,}/gi, "")
            .replace(/\n{2,}/g, "\n")
            .trim()
            .slice(0, 1500);

        const result = await llm.generate([
            {
                role: "system",
                content: GetPrompt(cleanedText)
            }
        ])

        return result.trim().toLowerCase() === "true";
    } catch (error) {
        console.error("CLASSIFICATION ERROR:", error);
        return false;
    }
};