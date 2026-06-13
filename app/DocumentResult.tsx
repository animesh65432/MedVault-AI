import DocumentScaning from "@/components/DocumentScaning";
import { API_KEY_SCANIMAGEURL, ScanImageUrl } from "@/config";
import { DocumentMetadata } from "@/types";
import { first } from "@/utils/first";
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { convert } from 'react-native-pdf-to-image';
import { Toast } from "toastify-react-native";

const scanImage = async (uri: string, type: string, name: string): Promise<string> => {
    console.log('scanImage →', { uri, type, name })
    const formData = new FormData()
    formData.append('image', { uri, name, type } as any)

    const response = await fetch(ScanImageUrl, {
        method: 'POST',
        headers: { 'X-API-Key': API_KEY_SCANIMAGEURL },
        body: formData,
    })

    console.log('scanImage status:', response.status)

    if (!response.ok) {
        const body = await response.text()
        console.error('scanImage error body:', body)
        throw new Error(`Worker error: ${response.status} – ${body}`)
    }

    const result = await response.json()
    console.log('scanImage result:', result)
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
            const name = first(fileName) ?? 'file'
            const type = first(fileType) ?? 'image/jpeg'

            let fullText = ''

            if (type === 'application/pdf') {
                const dest = `${FileSystem.documentDirectory}temp.pdf`;

                await FileSystem.copyAsync({
                    from: uri,
                    to: dest,
                });

                console.log('Copied PDF:', dest);

                const result = await convert(dest);;

            } else {
                fullText = await scanImage(uri, type, name)
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

    console.log('Extracted Text:', extractedText)

    return <View />
}

export default DocumentResult