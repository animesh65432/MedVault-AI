import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export type FieldRowItem = {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value?: string;
};

type Props = {
    items: FieldRowItem[];
    isEditable: boolean;
    onValueChange?: (label: string, value: string) => void;
};

const FieldRows: React.FC<Props> = ({ items, isEditable, onValueChange }) => {
    const visible = isEditable
        ? items
        : items.filter((item) => item.value && item.value.trim().length > 0);

    if (visible.length === 0) return null;

    return (
        <View style={styles.container}>
            {visible.map((item) => (
                <View key={item.label} style={styles.row}>
                    <View style={styles.iconWrap}>
                        <Feather name={item.icon} size={fs(14)} color="#234338" />
                    </View>
                    <View style={styles.textWrap}>
                        <Text style={styles.label}>{item.label}</Text>
                        {isEditable ? (
                            <TextInput
                                value={item.value ?? ""}
                                onChangeText={(text) => onValueChange?.(item.label, text)}
                                style={styles.valueInput}
                                placeholder={`Add ${item.label.toLowerCase()}`}
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                multiline
                            />
                        ) : (
                            <Text style={styles.value} numberOfLines={2}>
                                {item.value}
                            </Text>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(10),
    },
    row: {
        flexDirection: "row",
        gap: scale(10),
        alignItems: "flex-start",
    },
    iconWrap: {
        width: scale(26),
        height: scale(26),
        borderRadius: scale(8),
        backgroundColor: "#E5F0EB",
        alignItems: "center",
        justifyContent: "center",
        marginTop: scale(1),
    },
    textWrap: {
        flex: 1,
        gap: scale(1),
    },
    label: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Regular",
        color: "white",
    },
    value: {
        fontSize: fs(13.5),
        fontFamily: "Aeonik-Medium",
        color: "white",
    },
    valueInput: {
        fontSize: fs(13.5),
        fontFamily: "Aeonik-Medium",
        color: "white",
        padding: 0,
    },
});

export default FieldRows;