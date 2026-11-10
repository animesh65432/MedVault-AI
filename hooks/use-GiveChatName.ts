
import { GIVE_CHAT_NAME_URL } from "@/config";

interface GiveChatNameResponse {
    GiveChatName: (text: string) => Promise<string | null>;
}

export const useGiveChatName = (): GiveChatNameResponse => {
    const GiveChatName = async (text: string): Promise<string> => {
        try {
            const response = await fetch(GIVE_CHAT_NAME_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return data.title ?? "";

        } catch (error) {
            console.error("Error giving chat name:", error);
            return "";

        }
    };

    return { GiveChatName };
};
