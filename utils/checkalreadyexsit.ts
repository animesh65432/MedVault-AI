import { Model } from "@/services/model";
import * as FileSystem from "expo-file-system/legacy";

const getLocalPath = (remoteUrl: string) => {
    const filename = remoteUrl
        .replace("https://", "")
        .replaceAll("/", "_");
    return `${FileSystem.documentDirectory}react-native-executorch/${filename}`;
};

export const CheckAlreadyAiModelExist = async (): Promise<boolean> => {
    try {
        const modelPath = getLocalPath(Model.modelPath);
        const tokenizerPath = getLocalPath(Model.tokenizerPath);
        const tokenizerConfigPath = getLocalPath(Model.tokenizerConfigPath);

        const [modelInfo, tokenizerInfo, tokenizerConfigInfo] = await Promise.all([
            FileSystem.getInfoAsync(modelPath),
            FileSystem.getInfoAsync(tokenizerPath),
            FileSystem.getInfoAsync(tokenizerConfigPath),
        ]);
        return modelInfo.exists && tokenizerInfo.exists && tokenizerConfigInfo.exists;
    } catch (error) {
        console.error("[CheckAlreadyAiModelExist] Error checking model file:", error);
        return false;
    }
};