import { API_KEY, CheckIsMedicalRealatedOrNot } from "@/config";
import { useState } from "react";

export const useCheckIsMedicalRelated = () => {
    const [error, setError] = useState<string | null>(null);

    const CheckIsMedicalOrNot = async (textOcr: string): Promise<boolean> => {
        const response = await fetch(CheckIsMedicalRealatedOrNot, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
            },
            body: JSON.stringify({ textOcr }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            const message =
                data.message ||
                data.error ||
                "OCR request failed";

            setError(message);
        }


        if (typeof data.isMedical !== "boolean") {
            setError("Someting went wrong please try again later.");
        }

        return data.isMedical;
    };

    return {
        error,
        setError,
        CheckIsMedicalOrNot,
    };
};