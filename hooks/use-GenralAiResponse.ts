import { GenralAiResponseUrl } from "@/config";
import { useState } from "react";

export const useGenralAiResponse = () => {
    const [error, setError] = useState<string | null>(null);

    const GenralAiResponse = async (text: string) => {
        try {
            const response = await fetch(GenralAiResponseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text,
                }),
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            if (!data.success) {
                throw new Error(data.error || "Unknown error");
            }

            return data.airesponse
        }
        catch (err: any) {
            setError(err);
            console.log("CheckMessageType", err);
        }
    }

    return { error, GenralAiResponse }
}
