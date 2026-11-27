import { ChatMessagePayload } from "@/types";
import { MakeSuggestedQuestionsUrl } from "../config";

export const useSuggestedQuestions = () => {
    const MakeSuggestedQuestions = async (question: string, history: ChatMessagePayload[]) => {
        try {
            const response = await fetch(MakeSuggestedQuestionsUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question,
                    history
                }),
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            const parsedData = JSON.parse(data.answer);

            return parsedData.suggested_questions;
        }
        catch (err: any) {
            console.log("MakeSuggestedQuestions", err);
        }
    }

    return { MakeSuggestedQuestions }
}

