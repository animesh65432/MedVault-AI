import { ExcuteLlmUrl } from "@/config";
import { useState } from "react";

export const useMakeSqlRaw = () => {
    const [error, setError] = useState<string | null>(null);
    const MakesqlRaw = async (text: string) => {
        try {
            const response = await fetch(ExcuteLlmUrl, {
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
            return data.sql as string
        }
        catch (err: any) {
            setError(err);
            console.log("CheckMessageType", err);
        }
    }
    return { error, MakesqlRaw }
}
