import { ExplainWithDocumentUrl } from "@/config";
import { ChatMessagePayload } from "@/types";
import { useState } from "react";

export const useExplainDocumentsWithAiReponse = () => {
    const [error, setError] = useState<string | null>(null);

    const ExplainDocumentsWithAiReponse = async (
        question: string,
        data: unknown,
        userName: string,
        history: ChatMessagePayload[] = []
    ) => {
        try {
            setError(null);

            const response = await fetch(ExplainWithDocumentUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.EXPO_PUBLIC_MEDVAULT_API_KEY ?? "",
                },
                body: JSON.stringify({
                    question,
                    data,
                    history,
                    userName
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP ${response.status}`);
            }

            return result.answer as string;
        } catch (err: any) {
            setError(err.message ?? String(err));
            console.log("ExplainDocumentsWithAiReponse error:", err);
            return undefined;
        }
    };

    return { error, ExplainDocumentsWithAiReponse };
};