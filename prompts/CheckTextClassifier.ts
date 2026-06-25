export function GetPrompt(text: string) {
    return `Return ONLY True or False.
Is the text related to healthcare or medicine?
Text:
${text}`
}