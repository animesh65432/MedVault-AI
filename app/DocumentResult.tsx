import DocumentScaning from "@/components/DocumentScaning";
import { CheckMedicalClassification } from "@/hooks/checkMedicalClassification";
import { useImageTextExtractor } from "@/hooks/useImageTextExtractor";
import { DocumentMetadata } from "@/types";
import { first } from "@/utils/first";
import { extractText, isAvailable } from 'expo-pdf-text-extract';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { QWEN3_0_6B_QUANTIZED, useLLM } from "react-native-executorch";


const DocumentResult: React.FC = () => {
    const ran = useRef(false)
    const [documentData, setDocumentData] = useState<DocumentMetadata | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { fileUri, fileName, fileType } = useLocalSearchParams()
    const { extractTextFromImageUri } = useImageTextExtractor();
    const llm = useLLM({
        model: QWEN3_0_6B_QUANTIZED,
    })

    const processDocument = useCallback(async () => {
        if (!fileUri || !fileName || !fileType) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            const uri = first(fileUri)
            const type = first(fileType) ?? 'image/jpeg'

            let fullText = ''

            if (type === 'application/pdf') {

                const available = isAvailable();

                if (available) {

                    const text = await extractText(uri);

                    // const CheckIfMedicalOrNot = await CheckMedicalClassification(context, text)

                    // if (!CheckIfMedicalOrNot) {
                    //     Toast.error('The uploaded document is not a medical document. Please upload a valid medical document.')
                    //     router.back()
                    //     return;
                    // }

                    // const MedicalDocument = await MakeMedicalDocuments(context, text)

                    // setDocumentData(MedicalDocument)

                    // fullText = text ?? '';

                } else {

                    ('Sorry, PDF text extraction is not available on this platform.')

                }

            } else {

                fullText = await extractTextFromImageUri(uri) || ""

                const CheckIfMedicalOrNot = await CheckMedicalClassification(llm, fullText)

                console.log("CheckIfMedicalOrNot", CheckIfMedicalOrNot, fullText)

                if (!CheckIfMedicalOrNot) {
                    // Toast.error('The uploaded document is not a medical document. Please upload a valid medical document.')
                    router.back()
                    return;
                }

                console.log(CheckIfMedicalOrNot, "CheckIfMedicalOrNot", fullText)

                // const MedicalDocument = await MakeMedicalDocuments(context, fullText)

                // setDocumentData(MedicalDocument)

            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            console.error('processDocument failed:', message, error)
        } finally {
            setIsLoading(false)
        }
    }, [fileUri])

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        processDocument();
    }, []);

    if (isLoading) {
        return (
            <DocumentScaning
                fileUri={first(fileUri)}
                fileName={first(fileName)}
                fileType={first(fileType)}
            />
        )
    }
    return <View></View>
}

export default DocumentResult;
