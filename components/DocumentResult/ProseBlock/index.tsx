import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
    label: string;
    text?: string;
    isEditable: boolean;
    onChangeText: (type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter", label: string, value: string) => void;
    type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter";
    fieldKey: string;
};

const ProseBlock: React.FC<Props> = ({ fieldKey, type, label, text, isEditable, onChangeText }) => {
    if ((!text || text.trim().length === 0) && !isEditable) return null;

    const handleChangeText = (value: string) => {
        onChangeText(type, fieldKey, value);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {isEditable ? (
                <TextInput
                    value={text ?? ""}
                    onChangeText={handleChangeText}
                    style={styles.textInput}
                    placeholder={`Add ${label.toLowerCase()}`}
                    placeholderTextColor="#B4B2A9"
                    multiline
                    textAlignVertical="top"
                />
            ) : (
                <Text style={styles.text}>{text}</Text>
            )}
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
    textInput: {
        fontSize: fs(13.5),
        fontFamily: "Aeonik-Regular",
        color: "#0D1F1C",
        lineHeight: fs(13.5) * 1.6,
        backgroundColor: "#FAFAF8",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        padding: scale(12),
        minHeight: scale(80),
    },
});

export default ProseBlock;