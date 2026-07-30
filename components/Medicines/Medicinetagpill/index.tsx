import { MedicineTag } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

const ICONS: Record<MedicineTag["icon"], keyof typeof Ionicons.glyphMap> = {
    sun: "sunny-outline",
    moon: "moon-outline",
    utensils: "restaurant-outline",
    coffee: "cafe-outline",
}

const MedicineTagPill: React.FC<{ tag: MedicineTag }> = ({ tag }) => {
    const isAccent = tag.tone === "accent"
    return (
        <View style={[styles.pill, isAccent ? styles.pillAccent : styles.pillNeutral]}>
            <Ionicons
                name={ICONS[tag.icon]}
                size={scale(12)}
                color={isAccent ? "#2F6B4F" : "#7A8C84"}
            />
            <Text style={[styles.text, isAccent ? styles.textAccent : styles.textNeutral]}>
                {tag.label}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
        paddingHorizontal: scale(8),
        paddingVertical: vScale(4),
        borderRadius: scale(20),
    },
    pillAccent: {
        backgroundColor: "#E3F3E9",
    },
    pillNeutral: {
        backgroundColor: "#F1F3F2",
    },
    text: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(13),
    },
    textAccent: {
        color: "#2F6B4F",
    },
    textNeutral: {
        color: "#7A8C84",
    },
})

export default MedicineTagPill