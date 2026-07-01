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

            const reponsePrased = await response.json()

            if (!reponsePrased.success) {
                throw new Error(reponsePrased.error ?? "Unknown error");
            }

            return reponsePrased.data as DocumentType
        }
        catch (err: any) {
            setError(err);
            console.log("Error in makeMedicalDataJson:", err);
        }
    }
    return { error, makeMedicalDataJson }
}
