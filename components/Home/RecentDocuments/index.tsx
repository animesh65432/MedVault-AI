import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { GetDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Documents from "../../Documents";

const RecentDocuments = () => {
    const router = useRouter()
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
            <View style={style.titleAndSeeAllContainer}>
                <Text style={style.title}>
                    Recent Documents
                </Text>
                <TouchableOpacity
                    onPress={() => router.push("/Search")}
                >
                    <Text style={style.SeeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            {IsLoading ?
                <DocumentsSkeleton
                    count={2}
                /> :
                <Documents
                    documents={recentDocuments}
                    IsHome={true}
                />
            }
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
    },
    titleAndSeeAllContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    SeeAllText: {
        fontSize: scale(14),
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
        textDecorationLine: 'underline'
    }
})

export default RecentDocuments