import DocumentResult from '@/components/DocumentResult';
import DocumentScanning from '@/components/DocumentScaning';
import { useCheckIsMedicalRelated } from "@/hooks/useCheckIsMedicalRelated";
import { useImageTextExtractor } from '@/hooks/useImageTextExtractor';
import { usemakeclassifymedical } from "@/hooks/usemakeclassifymedical";
import { useMakeMedicalDataJson } from "@/hooks/useMakeMedicalDataJson";
import { DocumentType } from "@/types";
import { first } from '@/utils/first';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { extractText } from "expo-pdf-text-extract";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/AntDesign';



const ShowDocument = () => {
    const [IsProcessing, setIsProcessing] = useState(false);
    const { fileUri, fileName, fileType } = useLocalSearchParams();
    const router = useRouter();
    const [Document, SetDocument] = useState<DocumentType | null>(null)
    const { extractTextFromImageUri } = useImageTextExtractor()
    const { CheckIsMedicalOrNot } = useCheckIsMedicalRelated()
    const { makeclassifymedical } = usemakeclassifymedical()
    const { makeMedicalDataJson } = useMakeMedicalDataJson()

    const isPdf = first(fileType) === 'application/pdf';

    const MAX_INPUT_TOKENS = 4000;

    const isTextTooLarge = (text: string) => {
        const estimatedTokens = Math.ceil(text.length / 4);
        return estimatedTokens > MAX_INPUT_TOKENS;
    };

    const handleUpload = async () => {
        setIsProcessing(true);

        let extractedText = "";

        try {
            extractedText = !isPdf
                ? (await extractTextFromImageUri(first(fileUri) as string)) || ""
                : await extractText(first(fileUri) as string);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Couldn't read this document",
                text2: error instanceof Error ? error.message : "Please try a clearer photo or a different file.",
            });
            setIsProcessing(false);
            return;
        }

        if (isTextTooLarge(extractedText)) {
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
            Toast.show({
                type: "error",
                text1: "Couldn't verify this document",
                text2: error instanceof Error ? error.message : "Please check your connection and try again.",
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

            console.log("Medical Data:", medicalData);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Couldn't extract document details",
                text2: error instanceof Error ? error.message : "Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetake = () => {
        router.back();
    };

    if (IsProcessing) {
        return <DocumentScanning
            fileUri={first(fileUri) as string}
            fileName={first(fileName) as string}
            fileType={first(fileType) as string}
        />
    }

    if (Document && !IsProcessing) {
        return <DocumentResult
            document={Document}
            isPdf={isPdf}
            fileUri={first(fileUri) as string}
            fileName={first(fileName) as string}
        />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Confirm Upload</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                        <MaterialIcons name="close" size={scale(22)} color="#222" />
                    </TouchableOpacity>
                </View>


                <View style={styles.previewCard}>
                    {isPdf ? (
                        <View style={styles.pdfPlaceholder}>
                            <MaterialIcons name="picture-as-pdf" size={scale(64)} color="#064E3B" />
                            <Text style={styles.pdfLabel}>PDF Document</Text>
                        </View>
                    ) : (
                        <Image
                            source={{ uri: first(fileUri) }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    )}
                </View>

                <Text style={styles.fileName} numberOfLines={1}>
                    {first(fileName) || 'Document'}
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        activeOpacity={0.85}
                        onPress={handleUpload}
                    >
                        <MaterialIcons name="check-circle" size={scale(20)} color="#fff" />
                        <Text style={styles.uploadText}>Looks Good, Upload</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.retakeButton}
                        activeOpacity={0.85}
                        onPress={handleRetake}
                    >
                        <MaterialIcons name="replay" size={scale(20)} color="#064E3B" />
                        <Text style={styles.retakeText}>Retake</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
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
        marginBottom: vScale(24),
    },
    headerTitle: {
        fontFamily: 'Aeonik-Bold',
        fontSize: scale(20),
        color: '#111',
    },
    closeBtn: {
        padding: scale(4),
    },
    previewCard: {
        width: '100%',
        height: vScale(340),
        borderRadius: scale(18),
        overflow: 'hidden',
        backgroundColor: '#F1F5F4',
        borderWidth: 1,
        borderColor: '#D1E0DC',
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
        color: '#064E3B',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: vScale(12),
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    overlayPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: scale(12),
        paddingVertical: vScale(5),
        borderRadius: scale(20),
    },
    overlayText: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(12),
        color: '#fff',
    },
    fileName: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#6B7280',
        marginTop: vScale(12),
        marginBottom: vScale(24),
        textAlign: 'center',
    },
    actions: {
        gap: vScale(12),
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        backgroundColor: '#064E3B',
        paddingVertical: vScale(16),
        borderRadius: scale(14),
    },
    uploadText: {
        fontFamily: 'Aeonik-Bold',
        fontSize: scale(16),
        color: '#fff',
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        borderWidth: 1,
        borderColor: '#064E3B',
        paddingVertical: vScale(16),
        borderRadius: scale(14),
        backgroundColor: '#fff',
    },
    retakeText: {
        fontFamily: 'Aeonik-Bold',
        fontSize: scale(16),
        color: '#064E3B',
    },
});

export default ShowDocument;