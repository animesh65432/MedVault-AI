import { PatientSummary } from "@/db/patient_summary";
import { buildHtml } from "@/utils/useMakehtml";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from 'expo-print';

export const useGenratePdf = async (patientsummary: PatientSummary): Promise<string> => {
    const htmlContent = buildHtml(patientsummary);
    try {
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false,
        });

        const contentUri = await FileSystem.getContentUriAsync(uri);

        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri,
            flags: 1,
            type: "application/pdf",
        });

        return uri;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}