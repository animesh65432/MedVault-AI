import { GetDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { scale } from '@/utils/scale';
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Empty from './Empty';
import Input from './Input';
import NonEmpty from "./NonEmpty";


const Search: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [Documents, setDocuments] = useState<DocumentRow[]>([])
    const db = useSQLiteContext()

    async function fetchDocuments(query: string) {
        try {
            const documents = await GetDocuments(db, "DESC", 10)
            setDocuments(documents)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchDocuments(searchQuery)
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchQuery])

    useFocusEffect(
        React.useCallback(() => {
            fetchDocuments(searchQuery)
        }, [searchQuery])
    )

    const hasQuery = searchQuery.trim().length > 0

    return (
        <View style={styles.container}>
            <Input
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {Documents.length === 0 ? (
                <Empty hasQuery={hasQuery} />
            ) : (
                <NonEmpty />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(20),
        paddingTop: vScale(45),
        paddingBottom: vScale(32),
        flex: 1,
        flexDirection: "column",
        gap: vScale(14),
    }
})

export default Search