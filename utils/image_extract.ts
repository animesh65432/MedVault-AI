import { Asset } from "expo-asset";
import { LlamaContext } from "llama.rn";

export const extractTextFromImage = async (
    context: LlamaContext
): Promise<string> => {
    try {
        console.log("===== VISION TEST =====");

        console.log(
            "Multimodal enabled:",
            await context.isMultimodalEnabled()
        );

        console.log(
            "Support:",
            await context.getMultimodalSupport()
        );

        console.log("Context ID:", context.id);


        const asset = Asset.fromModule(
            require("../assets/images/empty-stats.png")
        );

        await asset.downloadAsync();

        const imageUri = asset.localUri;

        console.log("Asset URI:", imageUri);

        if (!imageUri) {
            throw new Error("Asset localUri is null");
        }


        console.log("START COMPLETION");

        const response = await context.completion({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Describe this image"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUri
                            }
                        }
                    ]
                }
            ],
            n_predict: 1,
            temperature: 0
        });

        console.log("COMPLETION FINISHED");
        console.log(response);

        return ""

    } catch (error) {
        console.error("VISION ERROR:", error);
        return "";
    }
};