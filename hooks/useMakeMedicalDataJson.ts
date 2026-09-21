import { API_KEY, MakeMedicalDataJsonUrl } from "@/config";
import { DocumentType } from "@/types";
import { useState } from "react";

export const useMakeMedicalDataJson = () => {
    const [error, setError] = useState<string | null>(null);
    const makeMedicalDataJson = async (textOcr: string, docType: string) => {
        try {
            const response = await fetch(MakeMedicalDataJsonUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                },
                body: JSON.stringify({
                    textOcr,
                    doc_type: docType
                }),
            })

            const data = await response.json();

            if (!response.ok || !data.success) {
                const message =
                    data.message ||
                    data.error ||
                    "OCR request failed";

                setError(message);
            }

            return data.data as DocumentType
        }
        catch (err: any) {
            setError(err);
            console.log("Error in makeMedicalDataJson:", err);
        }
    }
    return { error, makeMedicalDataJson }
}
