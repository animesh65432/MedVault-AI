import { Medicine } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    isMedicineModalVisible: boolean;
    setMedicineModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onAddMedicine?: (medicine: Medicine) => void;
};

const EMPTY: Medicine = { name: "", dosage: "", frequency: "", duration: "", timing: "" };

const AddMedicineModal: React.FC<Props> = ({
    isMedicineModalVisible,
    setMedicineModalIsVisible,
    onAddMedicine,
}) => {
    const [medicine, setMedicine] = useState<Medicine>(EMPTY);

    const update = (field: keyof Medicine, value: string) =>
        setMedicine((prev) => ({ ...prev, [field]: value }));

    const close = () => {
        setMedicine(EMPTY);
        setMedicineModalIsVisible(false);
    };

    const handleSave = () => {
        if (!medicine.name.trim()) return;
        onAddMedicine?.(medicine);
        setMedicine(EMPTY);
    };

    return (
        <Modal visible={isMedicineModalVisible} animationType="fade" transparent>
            <Pressable style={styles.backdrop} onPress={close}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Medicine</Text>
                        <TouchableOpacity onPress={close} hitSlop={8}>
                            <Feather name="x" size={fs(18)} color="#5F5E5A" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={medicine.name}
                        onChangeText={(t) => update("name", t)}
                        placeholder="Medicine name"
                        placeholderTextColor="#B4B2A9"
                        style={styles.nameInput}
                        autoFocus
                    />

                    <View style={styles.grid}>
                        <Field
                            label="Dosage"
                            value={medicine.dosage}
                            onChangeText={(t) => update("dosage", t)}
                        />
                        <Field
                            label="Frequency"
                            value={medicine.frequency}
                            onChangeText={(t) => update("frequency", t)}
                        />
                        <Field
                            label="Duration"
                            value={medicine.duration}
                            onChangeText={(t) => update("duration", t)}
                        />
                        <Field
                            label="Timing"
                            value={medicine.timing}
                            onChangeText={(t) => update("timing", t)}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, !medicine.name.trim() && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!medicine.name.trim()}
                    >
                        <Text style={styles.saveButtonText}>Add Medicine</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const Field = ({
    label,
    value,
    onChangeText,
}: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
}) => (
    <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={label}
            placeholderTextColor="#B4B2A9"
            style={styles.fieldInput}
        />
    </View>
);

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(13,31,28,0.4)",
        justifyContent: "space-around",
    },
    sheet: {
        backgroundColor: "#FAFAF8",
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        padding: scale(16),
        gap: scale(12),
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    nameInput: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(8),
    },
    fieldWrap: {
        flexBasis: "47%",
        gap: scale(4),
    },
    fieldLabel: {
        fontSize: fs(10),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color: "#5F5E5A",
    },
    fieldInput: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
    },
    saveButton: {
        backgroundColor: "#234338",
        borderRadius: scale(20),
        paddingVertical: scale(12),
        alignItems: "center",
        marginTop: scale(4),
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#EEF6A2",
    },
});

export default AddMedicineModal;