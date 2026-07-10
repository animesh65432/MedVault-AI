import UploadButtom from "@/components/UploadButtom"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from 'react'
import { StyleSheet, Text, View } from "react-native"
import Feather from "react-native-vector-icons/Feather"

type Props = {
    hasQuery: boolean
}

const Empty: React.FC<Props> = ({ hasQuery }) => {

    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Feather name="search" size={scale(40)} color="#23423B" />
            </View>
            <Text style={styles.title}>
                {hasQuery ? "No Results Found" : "No Documents Yet"}
            </Text>
            <Text style={styles.description}>
                {hasQuery
                    ? "Try a different search term or check the spelling."
                    : "Upload your first document to start building your medical history."}
            </Text>
            {!hasQuery && (
                <UploadButtom />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        gap: vScale(8),
        paddingHorizontal: scale(20),
        marginTop: vScale(40),
    },
    iconWrapper: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        backgroundColor: "#FAFAF8",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: vScale(12),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "#23423B",
    },
    description: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(14),
        color: "#5A7A74",
        textAlign: "center",
        lineHeight: vScale(20),
        marginBottom: vScale(20),
    },
    uploadButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(8),
        backgroundColor: "#23423B",
        borderRadius: scale(14),
        paddingVertical: vScale(14),
        paddingHorizontal: scale(24),
        width: "100%",
    },
    uploadText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#EEF6A2",
    },
})

export default Empty