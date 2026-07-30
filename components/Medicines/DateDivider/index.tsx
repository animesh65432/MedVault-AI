import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

interface DateDividerProps {
    label: string
}

const DateDivider: React.FC<DateDividerProps> = ({ label }) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.label}>{label}</Text>
            <View style={styles.line} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        marginVertical: vScale(4),
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#E3E9E6",
    },
    label: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        letterSpacing: 0.5,
        color: "#565756",
    },
})

export default DateDivider