import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    label: string;
    items: string[];
    isEditable: boolean;
    onUpdateItem?: (index: number, value: string) => void;
    onRemoveItem?: (index: number) => void;
    onAddItem?: () => void;
};

const BulletList: React.FC<Props> = ({ label, items, isEditable, onUpdateItem, onRemoveItem, onAddItem }) => {
    if (items.length === 0 && !isEditable) return null;

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>{label}</Text>
                {isEditable && (
                    <TouchableOpacity onPress={onAddItem} hitSlop={8} style={styles.addRow}>
                        <Feather name="plus" size={fs(12)} color="#234338" />
                        <Text style={styles.addRowText}>Add</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.list}>
                {items.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.bullet}>{index + 1}.</Text>
                        {isEditable ? (
                            <TextInput
                                value={item}
                                onChangeText={(text) => onUpdateItem?.(index, text)}
                                style={styles.textInput}
                                multiline
                                placeholder="Add a procedure"
                                placeholderTextColor="#B4B2A9"
                            />
                        ) : (
                            <Text style={styles.text}>{item}</Text>
                        )}
                        {isEditable && (
                            <TouchableOpacity onPress={() => onRemoveItem?.(index)} hitSlop={8}>
                                <Feather name="x" size={fs(14)} color="#B3261E" />
                            </TouchableOpacity>
                        )}
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
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    addRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
    },
    addRowText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    list: {
        gap: scale(6),
    },
    row: {
        flexDirection: "row",
        gap: scale(8),
        alignItems: "flex-start",
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
    textInput: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        flex: 1,
        lineHeight: fs(13) * 1.5,
        padding: 0,
    },
});

export default BulletList;