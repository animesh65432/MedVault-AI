import { DocumentRow } from "@/types";
import { File } from "expo-file-system";
import Share from "react-native-share";

const getExt = (doc: DocumentRow) => {
    if (doc.IsPdf) return "pdf";

    const p = doc.SourceFilePath.split("?")[0].toLowerCase();

    if (p.endsWith(".png")) return "png";
    if (p.endsWith(".webp")) return "webp";

    return "jpg";
};

const getMime = (doc: DocumentRow) => {
    const ext = getExt(doc);

    if (ext === "pdf") return "application/pdf";
    if (ext === "png") return "image/png";
    if (ext === "webp") return "image/webp";

    return "image/jpeg";
};

const ensureLocal = async (doc: DocumentRow): Promise<string> => {
    const src = doc.SourceFilePath;

    if (!src) {
        throw new Error(`Document ${doc.Id} has no file path`);
    }

    const file = new File(src);

    if (!file.exists) {
        throw new Error(
            `File missing on disk: ${src} (doc ${doc.Id})`
        );
    }

    const base64 = await file.base64();

    return `data:${getMime(doc)};base64,${base64}`;
};

export const shareDocuments = async (docs: DocumentRow[]) => {
    if (docs.length === 0) return;

    const uris = await Promise.all(
        docs.map(ensureLocal)
    );

    if (docs.length === 1) {
        await Share.open({
            url: uris[0],
            type: getMime(docs[0]),
            useInternalStorage: true,
            failOnCancel: false,
        });
        return;
    }

    const allPdf = docs.every((d) => d.IsPdf);
    const allImages = docs.every((d) => !d.IsPdf);

    const type = allPdf
        ? "application/pdf"
        : allImages
            ? "image/*"
            : "*/*";

    await Share.open({
        urls: uris,
        type,
        useInternalStorage: true,
        failOnCancel: false,
    });
};