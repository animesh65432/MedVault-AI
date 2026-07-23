import { ClassificationChatType } from "@/config";
import { ChatType } from "@/types";
import { useState } from "react";

export const useCheckMessageType = () => {
    const [error, setError] = useState<string | null>(null);
    const CheckMessageType = async (text: string, hasCurrentDocument: boolean) => {
        try {
            const response = await fetch(ClassificationChatType, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text,
                    hasCurrentDocument
                }),
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data.intent as ChatType
        }
        catch (err: any) {
            setError(err);
            console.log("CheckMessageType", err);
        }
    }
    return { error, CheckMessageType }
}
