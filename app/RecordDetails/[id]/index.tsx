import DocumentSkeleton from "@/components/DocumentSkeleton";
import RecordNotFound from "@/components/NotFound";
import RecordDetailsPage from "@/components/RecordDetailsPage";
import { SelectedDocumentsContext } from "@/context/SelectedDocuments";
import { GetRecordById } from "@/db/Record";
import { GetDocumentsIdsByRecordId } from "@/db/document";
import { RecordDetails } from "@/types";
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import React, { useContext, useEffect, useState } from 'react';

const RecordPage: React.FC = () => {
    const db = useSQLiteContext();
    const { setSelectedDocumentsIds } = useContext(SelectedDocumentsContext);
    const [recordDetails, setRecordDetails] = useState<RecordDetails | null>(null);
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const { id } = useLocalSearchParams();

    async function fetchRecordDetails() {
        SetIsLoading(true);
        if (typeof id !== 'string') {
            SetIsLoading(false);
            console.error("Invalid medicine ID:", id);
            return;
        }
        let Id = Number(id);
        try {
            const { record } = await GetRecordById(db, Id);
            const DocumentIds = await GetDocumentsIdsByRecordId(db, Id);
            setSelectedDocumentsIds(DocumentIds);
            setRecordDetails(record);
        }
        catch (error) {
            console.log("Failed to fetch medicine details:", error);
        }
        finally {
            SetIsLoading(false);
        }

    }

    useEffect(() => {
        fetchRecordDetails()
    }, [id])

    if (IsLoading) {
        return <DocumentSkeleton />
    }

    if (!id || typeof id !== 'string' || isNaN(Number(id))) {
        return <RecordNotFound
            text="Record"
        />
    }

    if (!recordDetails) {
        return <RecordNotFound
            text="Record"
        />
    }

    return (
        <RecordDetailsPage
            record={recordDetails}
            id={Number(id)}
        />
    )
}

export default RecordPage