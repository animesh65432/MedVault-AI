import { API_KEY, CheckIsMedicalRealatedOrNot } from "@/config";
import { useState } from "react";

export const useCheckIsMedicalRelated = () => {
    const [error, setError] = useState<string | null>(null);

    const CheckIsMedicalOrNot = async (textOcr: string): Promise<boolean> => {
        setError(null);

        const response = await fetch(CheckIsMedicalRealatedOrNot, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
            },
            body: JSON.stringify({ textOcr }),
        });

        if (!response.ok) {
            throw new Error(`Classification request failed (${response.status})`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error ?? "Unknown classification error");
        }

        if (typeof data.isMedical !== "boolean") {
            throw new Error("Malformed response from classifier");
        }

        return data.isMedical;
    };

    return {
        error,
        setError,
        CheckIsMedicalOrNot,
    };
};