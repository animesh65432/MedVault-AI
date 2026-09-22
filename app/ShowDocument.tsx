import DocumentScanning from '@/components/DocumentScaning';
import { NetworkContext } from '@/context/Netwrok';
import { useCheckIsMedicalRelated } from "@/hooks/useCheckIsMedicalRelated";
import { useImageTextExtractor } from '@/hooks/useImageTextExtractor';
import { usemakeclassifymedical } from "@/hooks/usemakeclassifymedical";
import { useMakeMedicalDataJson } from "@/hooks/useMakeMedicalDataJson";
import { usePdfThumbnail } from "@/hooks/usePdfThumbnail";
import { DocumentType } from "@/types";
import { first } from '@/utils/first';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { extractText } from "expo-pdf-text-extract";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    StyleSheet
} from 'react-native';
import Toast from 'react-native-toast-message';


const ShowDocument = () => {
    const [IsProcessing, setIsProcessing] = useState(false);
    const { isOnline } = useContext(NetworkContext)
    const { fileUri, fileName, fileType } = useLocalSearchParams();
    const router = useRouter();
    const [Document, SetDocument] = useState<DocumentType | null>(null)
    const { extractTextFromImageUri, error: extractTextErrorMessage } = useImageTextExtractor()
    const { CheckIsMedicalOrNot, error: MedicalOrNotError } = useCheckIsMedicalRelated()
    const { makeclassifymedical, error: makeclassifymedicalError } = usemakeclassifymedical()
    const { makeMedicalDataJson, error: makeMedicalDataJsonError } = useMakeMedicalDataJson()
    const { thumbUri, thumbFailed } = usePdfThumbnail(fileUri as string)

    const isPdf = first(fileType) === 'application/pdf';

    const MAX_INPUT_TOKENS = 4000;

    const isTextTooLarge = (text: string) => {
        const estimatedTokens = Math.ceil(text.length / 4);
        return estimatedTokens > MAX_INPUT_TOKENS;
    };

    const handleUpload = async () => {
        setIsProcessing(true);

        let extractedText = "";
        if (!isOnline) {
            Toast.show({
                type: "error",
                text1: "No internet connection",
                text2: "Please check your connection and try again.",
            });
            setIsProcessing(false);
            return;
        }


        try {

            extractedText = !isPdf
                ? (await extractTextFromImageUri(first(fileUri) as string)) || ""
                : await extractText(first(fileUri) as string);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: extractTextErrorMessage || "Couldn't read this document",
                text2: "Please try again",
            });
            setIsProcessing(false);
            return;
        }

        if (!extractedText || extractedText.trim().length === 0) {
            Toast.show({
                type: "error",
                text1: "Couldn't read this document",
                text2: "Please try a clearer photo or a different file.",
            });
            setIsProcessing(false);
            return;
        }

        if (isTextTooLarge(extractedText)) {
            console.warn("Document is too large to process.");
            Toast.show({
                type: "error",
                text1: "Document is too large",
                text2: "Please upload a smaller document or split the PDF into multiple files.",
            });
            setIsProcessing(false);
            return;
        }

        let isMedical = false;

        try {
            isMedical = await CheckIsMedicalOrNot(extractedText);
        } catch (error) {
            console.warn("Error checking if document is medical:", error);
            Toast.show({
                type: "error",
                text1: MedicalOrNotError || "Couldn't determine if this is a medical document",
                text2: "Please try again"
            });
            setIsProcessing(false);
            return;
        }

        if (!isMedical) {
            Toast.show({
                type: "info",
                text1: "This doesn't look like a medical document",
                text2: "Try a prescription, lab report, or hospital discharge summary instead.",
            });
            setIsProcessing(false);
            return;
        }

        try {
            const medicalCategory = await makeclassifymedical(extractedText);

            const medicalData = (await makeMedicalDataJson(
                extractedText,
                medicalCategory!
            )) as DocumentType;

            SetDocument(medicalData);
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: makeclassifymedicalError || "Couldn't process this medical document",
                text2: error instanceof Error ? error.message : "Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetake = () => {
        router.back();
    };

    if (true) {
        return <DocumentScanning
            fileUri={first(fileUri) as string}
            fileName={first(fileName) as string}
            fileType={first(fileType) as string}
        />
    }

};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: vScale(40),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vScale(20),
    },
    headerTitle: {
        fontFamily: 'Aeonik-Bold',
        fontSize: scale(20),
        color: '#0D483F',
    },
    headerSubtitle: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(12),
        color: '#8A8A7C',
        marginTop: vScale(2),
    },
    closeBtn: {
        width: scale(32),
        height: scale(32),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#F1EFE8",
        borderRadius: scale(16),
    },
    previewCard: {
        width: '100%',
        height: vScale(280),
        borderRadius: scale(18),
        overflow: 'hidden',
        backgroundColor: '#F1EFE8',
        borderWidth: 0.5,
        borderColor: '#E5E3D8',
        shadowColor: '#0D483F',
        shadowOpacity: 0.1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pdfPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: vScale(10),
    },
    pdfLabel: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#0D483F',
    },
    titleAndDescription: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        paddingVertical: vScale(14),
    },
    IconWrapper: {
        width: scale(40),
        height: scale(40),
        backgroundColor: "#F1EFE8",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scale(12),
        flexShrink: 0,
    },
    fileMeta: {
        flex: 1,
        gap: vScale(2),
    },
    fileName: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#2C2C2A',
    },
    fileSubtext: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(11),
        color: '#8A8A7C',
    },
    actions: {
        gap: vScale(12),
        marginTop: vScale(4),
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        backgroundColor: '#0D483F',
        borderRadius: scale(999),
        height: vScale(52),
        paddingHorizontal: scale(6),
        shadowColor: '#0D483F',
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    uploadText: {
        flex: 1,
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#fff',
    },
    UploadIconWrapper: {
        width: scale(38),
        height: scale(38),
        backgroundColor: "#D9F99D",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(19),
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        height: vScale(52),
        borderRadius: scale(999),
        backgroundColor: '#F1EFE8',
        // filled neutral pill, not outlined — an outline next to a solid
        // primary button reads as disabled rather than "secondary action"
    },
    retakeText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#5F5E5A',
    },
});

export default ShowDocument;