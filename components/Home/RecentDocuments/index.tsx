import { GetDocuments } from "@/db/document"
import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Documents from "../Documents"
import SeeAllDocuments from "../SeeAllDocuments"

const RecentDocuments = () => {
    const [recentDocuments, setRecentDocuments] = useState<DocumentRow[]>([])
    const db = useSQLiteContext()

    async function fetchRecentDocuments() {
        try {
            console.log("Fetching recent documents...")
            const documents = await GetDocuments(db, "DESC", 2)
            setRecentDocuments(documents)
        } catch (error) {
            console.error("Failed to fetch recent documents:", error)
        }
    }

    useEffect(() => {
        fetchRecentDocuments();
    }, [])

    return (
        <View style={style.container}>
            <Text style={style.title}>
                Recent Documents
            </Text>
            <Documents
                documents={recentDocuments}
            />
            <SeeAllDocuments />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: scale(20)
    },
    title: {
        fontSize: scale(18),
        fontFamily: "Aeonik-Medium",
        color: "#23423B"
    }
})

export default RecentDocuments