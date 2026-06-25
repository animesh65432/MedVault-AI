import { GetPrompt } from "@/prompts/CreateDocumentData"
import { LlamaContext } from "llama.rn"

export const MakeMedicalDocuments = async (context: LlamaContext, text: string) => {
    try {
        const prompt = GetPrompt(text)

        const result = await context.completion({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
        })

        const raw = result.text.trim()
        const parsed = JSON.parse(raw)
        return parsed

    } catch (error) {
        throw new Error("Failed to create medical document data. Please try again.")
    }
}