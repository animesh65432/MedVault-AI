import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

interface SectionHeaderProps {
    title: string
    count: number
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    count,
}) => {
    return (
        <View style={styles.row}>
            <View style={styles.left}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(24),
        color: "#234338",
    },
    badge: {
        minWidth: scale(24),
        height: scale(24),
        paddingHorizontal: scale(6),
        borderRadius: scale(10),
        backgroundColor: "#D9F99D",
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(13),
        color: "#OD483F",
    },
})

export default SectionHeader