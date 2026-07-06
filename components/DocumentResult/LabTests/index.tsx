import { LabTest } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AddLabTestModel from "../AddLabTestModel";

type Props = {
    tests: LabTest[];
    isEditable: boolean;
    onChangeTest: (index: number, patch: Partial<LabTest>) => void;
    onRemoveTest: (index: number) => void;
    onAddTest: (test: LabTest) => void;
};

const statusColor = (status?: string) => {
    if (!status) return { bg: "#F1EFE8", text: "#5F5E5A" };
    const s = status.toLowerCase();
    if (s.includes("high") || s.includes("low") || s.includes("abnormal")) {
        return { bg: "#FCEBEB", text: "#A32D2D" };
    }
    if (s.includes("normal")) {
        return { bg: "#EAF3DE", text: "#3B6D11" };
    }
    return { bg: "#F1EFE8", text: "#5F5E5A" };
};

const LabTests: React.FC<Props> = ({ tests, isEditable, onChangeTest, onRemoveTest, onAddTest }) => {
    const [showLabModel, setShowLabModel] = useState(false);
    if (tests.length === 0 && !isEditable) return null;

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <View style={styles.titleLeft}>
                    <Text style={styles.title}>Test results</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{tests.length}</Text>
                    </View>
                </View>
                {isEditable && (
                    <TouchableOpacity onPress={() => setShowLabModel(true)} hitSlop={8}>
                        <Octicons name="plus-circle" size={fs(18)} color="#234338" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.list}>
                {tests.map((test, index) => {
                    const colors = statusColor(test.status);
                    const hasValue = test.value || test.unit || test.normal_range;

                    if (isEditable) {
                        return (
                            <View key={index} style={styles.editRow}>
                                <View style={styles.editRowTop}>
                                    <TextInput
                                        style={[styles.testName, styles.input, { flex: 1 }]}
                                        value={test.name}
                                        onChangeText={(text) => onChangeTest?.(index, { name: text })}
                                        placeholder="Test name"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                    <TouchableOpacity onPress={() => onRemoveTest?.(index)} hitSlop={8}>
                                        <Octicons name="x" size={fs(14)} color="#8A8880" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.editRowFields}>
                                    <TextInput
                                        style={[styles.value, styles.input, styles.smallField]}
                                        value={test.value ?? ""}
                                        onChangeText={(text) => onChangeTest?.(index, { value: text })}
                                        placeholder="Value"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                    <TextInput
                                        style={[styles.value, styles.input, styles.smallField]}
                                        value={test.unit ?? ""}
                                        onChangeText={(text) => onChangeTest?.(index, { unit: text })}
                                        placeholder="Unit"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                    <TextInput
                                        style={[styles.range, styles.input, styles.smallField]}
                                        value={test.normal_range ?? ""}
                                        onChangeText={(text) => onChangeTest?.(index, { normal_range: text })}
                                        placeholder="Normal range"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                    <TextInput
                                        style={[styles.statusText, styles.input, styles.smallField, { color: colors.text, backgroundColor: colors.bg }]}
                                        value={test.status ?? ""}
                                        onChangeText={(text) => onChangeTest?.(index, { status: text })}
                                        placeholder="Status"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                </View>
                            </View>
                        );
                    }

                    return (
                        <View key={`${test.name}-${index}`} style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Text style={styles.testName} numberOfLines={2}>
                                    {test.name || "Unnamed test"}
                                </Text>
                                {!!test.normal_range && (
                                    <Text style={styles.range}>
                                        Normal: {test.normal_range}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.rowRight}>
                                {hasValue && (
                                    <Text style={styles.value}>
                                        {test.value}
                                        {test.unit ? ` ${test.unit}` : ""}
                                    </Text>
                                )}
                                {!!test.status && (
                                    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                                        <Text style={[styles.statusText, { color: colors.text }]}>
                                            {test.status}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
            {
                showLabModel &&
                <AddLabTestModel
                    isLabTestModalVisible={showLabModel}
                    setLabTestModalVisible={setShowLabModel}
                    onAddTest={onAddTest}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(10),
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
    },
    title: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    countBadge: {
        backgroundColor: "#E5F0EB",
        borderRadius: scale(10),
        paddingHorizontal: scale(8),
        paddingVertical: scale(2),
    },
    countText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    list: {
        gap: scale(6),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FAFAF8",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        gap: scale(8),
    },
    rowLeft: {
        flex: 1,
        gap: scale(2),
    },
    rowRight: {
        alignItems: "flex-end",
        gap: scale(4),
    },
    editRow: {
        backgroundColor: "#FAFAF8",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        gap: scale(8),
    },
    editRowTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
    },
    editRowFields: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(6),
    },
    input: {
        padding: 0,
    },
    smallField: {
        minWidth: scale(64),
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
    },
    testName: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    range: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Regular",
        color: "#888780",
    },
    value: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    statusBadge: {
        borderRadius: scale(10),
        paddingHorizontal: scale(7),
        paddingVertical: scale(2),
    },
    statusText: {
        fontSize: fs(10),
        fontFamily: "Aeonik-Medium",
    },
});

export default LabTests;