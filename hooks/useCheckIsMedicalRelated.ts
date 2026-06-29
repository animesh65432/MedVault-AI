import { API_KEY, CheckIsMedicalRealatedOrNot } from "@/config";
import { useState } from "react";

export const useCheckIsMedicalRelated = () => {
    const [error, setError] = useState<string | null>(null);

    const CheckIsMedicalOrNot = async (textOcr: string) => {
        try {
            const response = await fetch(CheckIsMedicalRealatedOrNot, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                },
                body: JSON.stringify({
                    textOcr,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error ?? "Unknown error");
            }

            return data.text as string;
        } catch (err: any) {
            setError(err.message);
            console.error(err);
            return false;
        }
    };

    return {
        error,
        CheckIsMedicalOrNot,
    };
};