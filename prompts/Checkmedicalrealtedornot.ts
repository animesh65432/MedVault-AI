export async function GetPrompt(textOcr: string) {
    return `
    You are a classifier for a medical records app. Decide whether the text below is HEALTH-RELATED, meaning it involves medicine, medical care, or health products/services in any form. This includes:
- Prescriptions, lab/test results, doctor's notes, discharge/admission summaries
- Hospital, clinic, or pharmacy bills and billing statements
- Pharmacy or retail purchase receipts for medicines, first-aid supplies, or other health/wellness products
- Photos of medicine boxes, strips, or labels
- Any other document primarily about health, medicine, or medical care

Reply "False" only for documents with no health connection at all (e.g. a grocery receipt with no health items, an unrelated bill, a random photo, or an unrelated document).

Reply with exactly one word, "True" or "False", nothing else.

text: ${textOcr}
`
}