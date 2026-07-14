import { GetDocumentById } from "@/db/document";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from 'react';
import { View } from "react-native";

const Document: React.FC = () => {
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext()

    async function fetchDocument() {
        if (typeof id !== 'string') {
            console.error("Invalid document ID:", id);
            return;
        }
        let documentId = Number(id)
        try {
            const document = await GetDocumentById(db, documentId);
            console.log("Fetched document:", document);
        } catch (error) {
            console.error("Failed to fetch document:", error);
        }
    }

    useEffect(() => {
        fetchDocument();
    }, [id]);


    return (
        <View></View>
    )
}

export default Document