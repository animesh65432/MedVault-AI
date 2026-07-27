import { ExcuteLlmUrl } from "@/config";
import { ChatMessagePayload, TypeOfDocumenet } from "@/types";
import { useState } from "react";

type MakesqlRawResponse = {
    error: string;
    sql: string,
    countSql: string,
    table: string,
    types: TypeOfDocumenet[]
}


export const useMakeSqlRaw = () => {
    const [error, setError] = useState<string | null>(null);
    const MakesqlRaw = async (text: string, history: ChatMessagePayload[]) => {
        try {
            const response = await fetch(ExcuteLlmUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text,
                    history
                }),
            })

            const data = await response.json() as MakesqlRawResponse;

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            return data as MakesqlRawResponse
        }
        catch (err: any) {
            setError(err);
            console.log("CheckMessageType", err);
        }
    }
    return { error, MakesqlRaw }
}
