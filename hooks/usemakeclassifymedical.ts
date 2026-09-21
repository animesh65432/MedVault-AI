import { API_KEY, MakeclassifymedicalUrl } from "@/config";
import { useState } from "react";

export const usemakeclassifymedical = () => {
    const [error, setError] = useState<string | null>(null);

    const makeclassifymedical = async (textOcr: string) => {
        try {

            const response = await fetch(MakeclassifymedicalUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                },
                body: JSON.stringify({
                    textOcr,
                }),
            })

            const data = await response.json() as {
                error: string;
                category: string,
                success: boolean,
                message: string
            };

            if (!response.ok || !data.success) {
                const message =
                    data.message ||
                    data.error ||
                    "OCR request failed";

                throw new Error(message);
            }

            return data.category

        } catch (err: any) {
            setError(err.message);
            console.log("Error in makeclassifymedical:", err);
        }
    }

    return {
        error,
        makeclassifymedical,
    }
}

