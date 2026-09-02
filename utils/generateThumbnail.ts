import { getPDFCover } from "react-native-pdf-cover";

export async function generateThumbnail(pdfUri: string) {
    try {
        const cover = await getPDFCover({
            source: {
                uri: pdfUri,
            },
            page: 1,
            size: {
                width: 300,
                height: 400,
            },
        });

        console.log("Thumbnail:", cover);
        return cover;
    } catch (error) {
        console.error("Failed to generate thumbnail:", error);
        return ""
    }
}