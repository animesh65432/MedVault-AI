import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    label: string;
    text?: string;
};

const ProseBlock: React.FC<Props> = ({ label, text }) => {
    if (!text || text.trim().length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(6),
    },
    label: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    text: {
        fontSize: fs(13.5),
        fontFamily: "Aeonik-Regular",
        color: "#0D1F1C",
        lineHeight: fs(13.5) * 1.6,
        backgroundColor: "#FAFAF8",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        padding: scale(12),
    },
});

export default ProseBlock;