import { ChatMessage, ChatMessagePayload } from '@/types';

export const makeHistoryPayload = (
    messages: ChatMessage[],
    limit: number = 5
): ChatMessagePayload[] => {
    return messages
        .slice(-limit)
        .flatMap((m): ChatMessagePayload[] => {
            const turns: ChatMessagePayload[] = [
                { role: "user", content: m.UserMessage },
            ];
            if (m.AIResponse) {
                turns.push({ role: "assistant", content: m.AIResponse });
            }
            return turns;
        });
};