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
            };

            if (!data.success) {
                throw new Error(data.error ?? "Unknown error");
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

