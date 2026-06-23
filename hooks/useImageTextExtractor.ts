import { ScanImageUrl } from "@/config";
import { useState } from "react";

const API_KEY = "medvault-secret-123";

export const useImageTextExtractor = () => {
    const [extractedText, setExtractedText] = useState("");
    const [error, setError] = useState<string | null>(null);

    const extractTextFromImageUri = async (uri: string, mimeType = "image/jpeg") => {
        setError(null);
        try {

            const formData = new FormData();
            formData.append("image", {
                uri,
                type: mimeType,
                name: "image.jpg",
            } as any);

            const res = await fetch(ScanImageUrl, {
                method: "POST",
                headers: {
                    "X-API-Key": API_KEY,
                },
                body: formData,
            });

            const data = await res.json();

            if (!data.success) throw new Error(data.error ?? "Unknown error");

            setExtractedText(data.text);

            return data.text as string;
        } catch (err: any) {

            setError(err.message);

            return null;
        }
    };

    return { extractedText, error, extractTextFromImageUri };
};