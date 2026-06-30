import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    label: string;
    items: string[];
};

const BulletList: React.FC<Props> = ({ label, items }) => {
    if (items.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.list}>
                {items.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.bullet}>{index + 1}.</Text>
                        <Text style={styles.text}>{item}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(8),
    },
    label: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    list: {
        gap: scale(6),
    },
    row: {
        flexDirection: "row",
        gap: scale(8),
    },
    bullet: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
        width: scale(18),
    },
    text: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        flex: 1,
        lineHeight: fs(13) * 1.5,
    },
});

export default BulletList;