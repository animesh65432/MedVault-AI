import { GetDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Documents from "../../Documents";
import SeeAllDocuments from "../SeeAllDocuments";

const RecentDocuments = () => {
    const [IsLoading, setIsLoading] = useState<boolean>(false)
    const [recentDocuments, setRecentDocuments] = useState<DocumentRow[]>([])
    const db = useSQLiteContext()

    async function fetchRecentDocuments() {
        setIsLoading(true)
        try {
            const documents = await GetDocuments(db, "DESC", 2, 0)
            setRecentDocuments(documents)
        } catch (error) {
            console.error("Failed to fetch recent documents:", error)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRecentDocuments();
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchRecentDocuments();
        }, [])
    );

    return (
        <View style={style.container}>
            <Text style={style.title}>
                Recent Documents
            </Text>
            <Documents
                documents={recentDocuments}
                IsHome={true}
            />
            <SeeAllDocuments />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    title: {
        fontSize: scale(18),
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
        marginBottom: scale(20)
    }
})

export default RecentDocuments