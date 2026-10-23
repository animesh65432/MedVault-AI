import { DocumentRow } from "@/types";

export function getSelectedDocumentsDateRange(
    documents: DocumentRow[]
): { oldestDate: string; newestDate: string } | null {
    if (documents.length === 0) return null;

    const getDate = (document: DocumentRow) =>
        document.date ?? document.CreatedAt;

    let oldestDate = getDate(documents[0]);
    let newestDate = getDate(documents[0]);

    for (const document of documents) {
        const currentDate = getDate(document);

        if (currentDate.localeCompare(oldestDate) < 0) {
            oldestDate = currentDate;
        }

        if (currentDate.localeCompare(newestDate) > 0) {
            newestDate = currentDate;
        }
    }

    return { oldestDate, newestDate };
}
