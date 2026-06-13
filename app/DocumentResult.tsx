import DocumentScaning from "@/components/DocumentScaning";
import { DocumentMetadata } from "@/types";
import { first } from "@/utils/first";
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { Toast } from "toastify-react-native";

const DocumentResult: React.FC = () => {
    const [documentData, setDocumentData] = useState<DocumentMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { fileUri, fileName, fileType } = useLocalSearchParams();

    const processDocument = useCallback(async () => {
        if (!fileUri || !fileName || !fileType) {
            Toast.error('Missing file parameters');
            return;
        }
        setIsLoading(true);
        try {
        } catch (error) {
            console.error('OCR error:', error);
            Toast.error('Failed to extract text');
        } finally {
            setIsLoading(false);
        }
    }, [fileUri, fileName, fileType]);

    useEffect(() => {
        processDocument();
        return () => setDocumentData(null);
    }, [processDocument]);

    console.log('DocumentResult params:', { fileUri });

    if (true) {
        return (
            <DocumentScaning
                fileUri={first(fileUri)}
                fileName={first(fileName)}
                fileType={first(fileType)}
            />
        );
    }
};

export default DocumentResult;