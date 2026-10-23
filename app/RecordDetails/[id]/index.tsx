import DocumentSkeleton from "@/components/DocumentSkeleton";
import RecordNotFound from "@/components/NotFound";
import RecordDetailsPage from "@/components/RecordDetailsPage";
import { GetRecordById } from "@/db/Record";
import { DocumentRow, RecordDetails } from "@/types";
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';

const RecordPage: React.FC = () => {
    const db = useSQLiteContext();
    const [recordDetails, setRecordDetails] = useState<RecordDetails | null>(null);
    const [Documents, SetDocuments] = useState<DocumentRow[]>([])
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const { id } = useLocalSearchParams();

    async function fetchRecordDetails() {
        SetIsLoading(true);
        if (typeof id !== 'string') {
            console.error("Invalid medicine ID:", id);
            return;
        }
        let Id = Number(id);
        try {
            const { record, documents } = await GetRecordById(db, Id);
            setRecordDetails(record);
            SetDocuments(documents);
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

    if (!recordDetails) {
        return <RecordNotFound
            text="Record"
        />
    }

    return (
        <RecordDetailsPage
            record={recordDetails}
            Documents={Documents}
        />
    )
}

export default RecordPage