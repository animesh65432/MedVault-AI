export const removeThinkLlmResponse = (response: string): string => {
    const string = response.replace(/<think>[\s\S]*?<\/think>/g, "")
        .trim();
    return string
}