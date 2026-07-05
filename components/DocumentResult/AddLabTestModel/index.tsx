import { LabTest } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    isLabTestModalVisible: boolean;
    setLabTestModalVisible: (visible: boolean) => void;
    onAddTest: (test: LabTest) => void;
};

const emptyTest: LabTest = {
    name: "",
    value: "",
    unit: "",
    normal_range: "",
    status: "",
};

const AddLabTestModel: React.FC<Props> = ({
    isLabTestModalVisible,
    setLabTestModalVisible,
    onAddTest,
}) => {
    const [test, setTest] = useState<LabTest>(emptyTest);

    const onClose = () => {
        setTest(emptyTest);
        setLabTestModalVisible(false);
    };

    const onSave = () => {
        if (!test.name.trim()) return;
        onAddTest(test);
        setTest(emptyTest);
        setLabTestModalVisible(false);
    };

    const updateField = (field: keyof LabTest, value: string) => {
        setTest((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal
            visible={isLabTestModalVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.sheetWrap}
                >
                    <View style={styles.sheet}>
                        <View style={styles.handle} />

                        <View style={styles.headerRow}>
                            <Text style={styles.title}>Add test result</Text>
                            <TouchableOpacity onPress={onClose} hitSlop={8}>
                                <Feather name="x" size={fs(18)} color="#5F5E5A" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Test name</Text>
                            <TextInput
                                style={styles.input}
                                value={test.name}
                                onChangeText={(text) => updateField("name", text)}
                                placeholder="e.g. Hemoglobin"
                                placeholderTextColor="#B4B2A9"
                                autoFocus
                            />
                        </View>

                        <View style={styles.fieldRow}>
                            <View style={[styles.field, styles.flexField]}>
                                <Text style={styles.label}>Value</Text>
                                <TextInput
                                    style={styles.input}
                                    value={test.value}
                                    onChangeText={(text) => updateField("value", text)}
                                    placeholder="e.g. 13.5"
                                    placeholderTextColor="#B4B2A9"
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                            <View style={[styles.field, styles.flexField]}>
                                <Text style={styles.label}>Unit</Text>
                                <TextInput
                                    style={styles.input}
                                    value={test.unit}
                                    onChangeText={(text) => updateField("unit", text)}
                                    placeholder="e.g. g/dL"
                                    placeholderTextColor="#B4B2A9"
                                />
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Normal range</Text>
                            <TextInput
                                style={styles.input}
                                value={test.normal_range}
                                onChangeText={(text) => updateField("normal_range", text)}
                                placeholder="e.g. 12.0 - 15.5"
                                placeholderTextColor="#B4B2A9"
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Status</Text>
                            <TextInput
                                style={styles.input}
                                value={test.status}
                                onChangeText={(text) => updateField("status", text)}
                                placeholder="e.g. Normal, High, Low"
                                placeholderTextColor="#B4B2A9"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, !test.name.trim() && styles.saveButtonDisabled]}
                            onPress={onSave}
                            disabled={!test.name.trim()}
                        >
                            <Text style={styles.saveButtonText}>Add test</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(13, 31, 28, 0.5)",
        justifyContent: "space-around",
    },
    sheetWrap: {
        width: "100%",
    },
    sheet: {
        backgroundColor: "#FAFAF8",
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        paddingHorizontal: scale(20),
        paddingTop: scale(10),
        paddingBottom: scale(28),
        gap: scale(14),
    },
    handle: {
        alignSelf: "center",
        width: scale(36),
        height: scale(4),
        borderRadius: scale(2),
        backgroundColor: "#E5E4DD",
        marginBottom: scale(4),
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    field: {
        gap: scale(6),
    },
    fieldRow: {
        flexDirection: "row",
        gap: scale(10),
    },
    flexField: {
        flex: 1,
    },
    label: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#888780",
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    input: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Regular",
        color: "#0D1F1C",
        backgroundColor: "#F1EFE8",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
    },
    saveButton: {
        backgroundColor: "#234338",
        borderRadius: scale(12),
        paddingVertical: scale(14),
        alignItems: "center",
        marginTop: scale(6),
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#EEF6A2",
    },
});

export default AddLabTestModel;