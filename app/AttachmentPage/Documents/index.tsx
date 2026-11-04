import { GetDocuments } from "@/db/document"
import { DocumentRow } from "@/types"
import { useSQLiteContext } from "expo-sqlite"
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

type Props = {
    selected: string
}

const Documents: React.FC<Props> = ({ selected }) => {
    const db = useSQLiteContext();
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [documents, setDocuments] = useState<DocumentRow[]>([]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const docs = await GetDocuments(db, "DESC", 10, page, [selected]);
            setDocuments(docs);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={styles.Container}>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    }
})

export default Documents