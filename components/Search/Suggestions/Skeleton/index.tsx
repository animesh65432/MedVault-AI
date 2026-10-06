import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from 'react'
import { StyleSheet, View } from "react-native"

const Skeleton: React.FC = () => {
    return (
        <View style={styles.row}>
            <View style={styles.thumbnail} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.title} />
                    <View style={styles.date} />
                </View>

                <View style={styles.field} />

                <View style={styles.snippet} />
                <View style={styles.snippetShort} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: vScale(10),
    },

    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: scale(10),

        backgroundColor: "#FAFAF8",
        borderRadius: scale(12),
        padding: scale(14),
    },

    thumbnail: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(10),
        backgroundColor: "#E5E9E6",
    },

    content: {
        flex: 1,
        gap: vScale(6),
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scale(8),
    },

    title: {
        flex: 1,
        height: vScale(15),
        borderRadius: scale(5),
        backgroundColor: "#E1E6E3",
    },

    date: {
        width: scale(45),
        height: vScale(11),
        borderRadius: scale(4),
        backgroundColor: "#E5E9E6",
    },

    field: {
        width: "38%",
        height: vScale(11),
        borderRadius: scale(4),
        backgroundColor: "#E5E9E6",
    },

    snippet: {
        width: "100%",
        height: vScale(12),
        borderRadius: scale(4),
        backgroundColor: "#E5E9E6",
    },

    snippetShort: {
        width: "70%",
        height: vScale(12),
        borderRadius: scale(4),
        backgroundColor: "#E5E9E6",
    },
})

export default Skeleton