import DocumentScaning from "@/components/DocumentScaning";
import { DocumentMetadata } from "@/types";
import { first } from "@/utils/first";
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { extractText, isAvailable } from 'expo-pdf-text-extract';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Toast } from "toastify-react-native";

const scanImage = async (uri: string): Promise<string> => {
    const result = await TextRecognition.recognize(uri);
    return result.text ?? ''
}

const DocumentResult: React.FC = () => {
    const [documentData, setDocumentData] = useState<DocumentMetadata | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [extractedText, setExtractedText] = useState<string | null>(null)
    const { fileUri, fileName, fileType } = useLocalSearchParams()

    const processDocument = useCallback(async () => {
        if (!fileUri || !fileName || !fileType) {
            Toast.error('Missing file parameters')
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
                    fullText = text ?? '';
                } else {
                    Toast.error('PDF text extraction is not available on this device.')
                }

            } else {
                fullText = await scanImage(uri)
            }

            setExtractedText(fullText)

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            console.error('processDocument failed:', message, error)
            Toast.error(`Failed to scan document: ${message}`)
        } finally {
            setIsLoading(false)
        }
    }, [fileUri, fileName, fileType])

    useEffect(() => {
        processDocument()
        return () => {
            setDocumentData(null)
            setExtractedText(null)
        }
    }, [processDocument])

    if (isLoading) {
        return (
            <DocumentScaning
                fileUri={first(fileUri)}
                fileName={first(fileName)}
                fileType={first(fileType)}
            />
        )
    }

    console.log('DocumentResult extractedText:', extractedText)

    return <View></View>
}

export default DocumentResult;
