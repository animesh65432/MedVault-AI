import { } from "expo";
import { LlamaContext } from "llama.rn";

export const extractTextFromImage = async (
    context: LlamaContext,
    imageUri: string
): Promise<string> => {
    try {

        const nativePath = imageUri.replace("file://", "");

        console.log("Original:", imageUri);
        console.log("Native Path:", nativePath);

        const result = await context.completion({
            prompt: "Extract all text from this image",
            media_paths: [nativePath],
            n_predict: 256,
        });

        return result?.text?.trim() ?? "";

    } catch (error) {
        console.error("VISION ERROR:", error);
        return "";
    }
};