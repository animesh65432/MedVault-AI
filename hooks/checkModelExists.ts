import { Model } from "@/services/model";
import { ExpoResourceFetcher } from "react-native-executorch-expo-resource-fetcher";

const getFileNameFromUrl = (url: string) => url.split('/').pop() ?? url;

export const checkModelExists = async (): Promise<boolean> => {
    try {
        const downloadedFiles = await ExpoResourceFetcher.listDownloadedFiles();

        const hasModel = downloadedFiles.some((uri: string) =>
            uri.includes(getFileNameFromUrl(Model.modelPath))
        );
        const hasTokenizer = downloadedFiles.some((uri: string) =>
            uri.includes(getFileNameFromUrl(Model.tokenizerPath))
        );
        const hasTokenizerConfig = downloadedFiles.some((uri: string) =>
            uri.includes(getFileNameFromUrl(Model.tokenizerConfigPath))
        );
        return hasModel && hasTokenizer && hasTokenizerConfig;
    } catch (error) {
        console.error('Error checking model existence:', error);
        return false;
    }
};