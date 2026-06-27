import DocumentScanning from '@/components/DocumentScaning';
import { useImageTextExtractor } from '@/hooks/useImageTextExtractor';
import { useLLMStore } from "@/store/llm";
import { first } from '@/utils/first';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/AntDesign';

const ShowDocument = () => {
    const [IsProcessing, setIsProcessing] = useState(false);
    const { generate, loadModel, IsModelLoaded } = useLLMStore()
    const { fileUri, fileName, fileType } = useLocalSearchParams();
    const router = useRouter();
    const { extractTextFromImageUri } = useImageTextExtractor()

    const isPdf = first(fileType) === 'application/pdf';

    const handleUpload = async () => {

        setIsProcessing(true);

        try {
            await loadModel()

            if (!isPdf) {
                // const result = await extractTextFromImageUri(first(fileUri) as string)
                const result1 = await generate([{
                    role: "system",
                    content: "be best friend"
                },
                {
                    role: "user",
                    content: "i want to die"
                }
                ])

                console.log('Extracted Text:', result1);
            }
        }
        catch (error) {
            console.error('Error extracting text:', error);
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