import DocumentNotFound from "@/components/DocumentNotFound";
import DocumentSkeleton from "@/components/DocumentSkeleton";
import DocumentView from "@/components/DocumentView";
import { GetDocumentById } from "@/db/document";
import { UploadedDocument } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from 'react';

const Document: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [Document, setDocument] = React.useState<UploadedDocument | null>(null);
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext()

    async function fetchDocument() {
        if (typeof id !== 'string') {
            console.error("Invalid document ID:", id);
            return;
        }
        let documentId = Number(id)
        setLoading(true);
        try {
            const document = await GetDocumentById(db, documentId) as UploadedDocument | null;
            if (document) {
                setDocument(document);
            } else {
                console.error("Document not found for ID:", documentId);
            }
        } catch (error) {
            console.error("Failed to fetch document:", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDocument();
    }, [id]);

    if (loading) {
        return (
            <DocumentSkeleton />
        );
    }

    if (!Document) {
        return <DocumentNotFound />;
    }

    return (
        <DocumentView
            document={Document as UploadedDocument}
            setDocument={setDocument}
        />
    )
}

export default Document