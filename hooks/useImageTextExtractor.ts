import { API_KEY, ScanImageUrl } from "@/config";
import { useState } from "react";

export const useImageTextExtractor = () => {
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
            console.log("OCR Response:", data);
            if (!data.success) throw new Error(data.error ?? "Unknown error");
            return data.text as string;

        } catch (err: any) {

            console.log(err);

            setError(err.message);

            return null;
        }
    };

    return { error, extractTextFromImageUri };
};