import { CreateMedicine } from "@/db/medicines";
import { AddMedicineTypes, MedicineWithDetailsTypes } from "@/types";
import { FrequencyOptions } from "@/utils/frequencyOptions";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { TimingOptions } from "@/utils/timing";
import Feather from "@expo/vector-icons/Feather";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

const DosageUnitOptions = [
    { label: "mg", value: "mg" },
    { label: "ml", value: "ml" },
    { label: "tablet", value: "tablet" },
    { label: "drops", value: "drops" },
    { label: "puff", value: "puff" },
];

const DurationUnitOptions = [
    { label: "days", value: "days" },
    { label: "weeks", value: "weeks" },
    { label: "months", value: "months" },
];

type Props = {
    DocumentId: number | null;
    isMedicineModalVisible: boolean;
    setMedicineModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    addMedicineFromeState: (newMedicine: MedicineWithDetailsTypes) => void;
};

type DraftMedicine = {
    name: string;
    dosageValue: string;
    dosageUnit: string;
    frequency: string;
    durationValue: string;
    durationUnit: string;
    timings: string[];
};

const EMPTY: DraftMedicine = {
    name: "",
    dosageValue: "",
    dosageUnit: "mg",
    frequency: "as_needed",
    durationValue: "",
    durationUnit: "days",
    timings: [],

};

const AddMedicineModal: React.FC<Props> = ({
    isMedicineModalVisible,
    setMedicineModalIsVisible,
    DocumentId,
    addMedicineFromeState
}) => {
    const db = useSQLiteContext()
    const [IsLoadIng, SetIsLoading] = useState(false)
    const [draft, setDraft] = useState<DraftMedicine>(EMPTY);
    const [isFrequencyFocus, setIsFrequencyFocus] = useState(false);

    const update = <K extends keyof DraftMedicine>(field: K, value: DraftMedicine[K]) =>
        setDraft((prev) => ({ ...prev, [field]: value }));

    const toggleTiming = (value: string) => {
        setDraft((prev) => ({
            ...prev,
            timings: prev.timings.includes(value)
                ? prev.timings.filter((t) => t !== value)
                : [...prev.timings, value],
        }));
    };

    const close = () => {
        setDraft(EMPTY);
        setMedicineModalIsVisible(false);
    };

    const handleSave = async () => {
        SetIsLoading(true)
        try {
            if (!draft.name.trim()) return;

            const medicine: AddMedicineTypes = {
                name: draft.name.trim(),
                dosage: draft.dosageValue.trim() ? `${draft.dosageValue.trim()}${draft.dosageUnit}` : null,
                frequency: draft.frequency || null,
                duration: draft.durationValue.trim() ? `${draft.durationValue.trim()} ${draft.durationUnit}` : null,
                timings: draft.timings,
                reminders: [],
                timing: draft.timings,
                DocumentId: DocumentId
            } as AddMedicineTypes;

            const medicineId = await CreateMedicine(db, medicine)

            addMedicineFromeState({
                ...medicine,
                Id: medicineId,
                DocumentId: DocumentId,
            } as MedicineWithDetailsTypes);
        } catch (error) {
            console.log("Error saving medicine:", error);
        } finally {
            setDraft(EMPTY);
            setMedicineModalIsVisible(false);
            SetIsLoading(false)
        }
    };

    return (
        <Modal visible={isMedicineModalVisible} animationType="fade" transparent>
            <Pressable style={styles.backdrop} onPress={close}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Medicine</Text>
                        <TouchableOpacity onPress={close} hitSlop={8}>
                            <Feather name="x" size={fs(22)} color="#5F5E5A" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={draft.name}
                        onChangeText={(t) => update("name", t)}
                        placeholder="Medicine name"
                        placeholderTextColor="#B4B2A9"
                        style={styles.nameInput}
                        autoFocus
                    />

                    <View style={styles.grid}>
                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldLabel}>Dosage</Text>
                            <View style={styles.splitField}>
                                <TextInput
                                    value={draft.dosageValue}
                                    onChangeText={(t) => update("dosageValue", t)}
                                    placeholder="10"
                                    placeholderTextColor="#B4B2A9"
                                    keyboardType="numeric"
                                    style={styles.splitFieldInput}
                                />
                                <Dropdown
                                    style={styles.unitDropdown}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    itemTextStyle={styles.pickerItemText}
                                    containerStyle={styles.dropdownContainer}
                                    data={DosageUnitOptions}
                                    labelField="label"
                                    valueField="value"
                                    value={draft.dosageUnit}
                                    onChange={(item) => update("dosageUnit", item.value)}
                                />
                            </View>
                        </View>

                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldLabel}>Frequency</Text>
                            <Dropdown
                                style={[
                                    styles.dropdown,
                                    isFrequencyFocus && styles.dropdownFocused,
                                ]}
                                placeholderStyle={styles.dropdownPlaceholder}
                                selectedTextStyle={styles.dropdownSelectedText}
                                itemTextStyle={styles.pickerItemText}
                                containerStyle={styles.dropdownContainer}
                                data={FrequencyOptions as unknown as { label: string; value: string }[]}
                                maxHeight={220}
                                labelField="label"
                                valueField="value"
                                placeholder="Select"
                                value={draft.frequency}
                                onFocus={() => setIsFrequencyFocus(true)}
                                onBlur={() => setIsFrequencyFocus(false)}
                                onChange={(item) => {
                                    update("frequency", item.value);
                                    setIsFrequencyFocus(false);
                                }}
                            />
                        </View>

                        <View style={styles.fieldWrap}>
                            <Text style={styles.fieldLabel}>Duration</Text>
                            <View style={styles.splitField}>
                                <TextInput
                                    value={draft.durationValue}
                                    onChangeText={(t) => update("durationValue", t)}
                                    placeholder="5"
                                    placeholderTextColor="#B4B2A9"
                                    keyboardType="numeric"
                                    style={styles.splitFieldInput}
                                />
                                <Dropdown
                                    style={styles.unitDropdown}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    itemTextStyle={styles.pickerItemText}
                                    containerStyle={styles.dropdownContainer}
                                    data={DurationUnitOptions}
                                    labelField="label"
                                    valueField="value"
                                    value={draft.durationUnit}
                                    onChange={(item) => update("durationUnit", item.value)}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Timing</Text>
                        <View style={styles.timingRow}>
                            {(TimingOptions as unknown as { label: string; value: string }[]).map((opt) => {
                                const active = draft.timings.includes(opt.value);
                                return (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={[styles.timingChip, active && styles.timingChipActive]}
                                        onPress={() => toggleTiming(opt.value)}
                                        hitSlop={6}
                                    >
                                        <Text
                                            style={[
                                                styles.timingChipText,
                                                active && styles.timingChipTextActive,
                                            ]}
                                        >
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, !draft.name.trim() && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!draft.name.trim()}
                    >
                        <Text style={styles.saveButtonText}>
                            {IsLoadIng ? <ActivityIndicator
                                style={styles.Spinner}
                                color="white"
                            /> :
                                "Add Medicine"
                            }
                        </Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(13,31,28,0.4)",
        justifyContent: "space-around",
    },
    sheet: {
        backgroundColor: "#FAFAF8",
        borderRadius: scale(20),
        padding: scale(16),
        gap: scale(12),
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: fs(16),
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
        gap: scale(18),
    },
    fieldWrap: {
        display: "flex",
        flexDirection: "column",
        gap: scale(4),
    },
    fieldLabel: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color: "#5F5E5A",
    },
    splitField: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1EFE8",
        borderRadius: scale(13),
        paddingHorizontal: scale(10),
    },
    splitFieldInput: {
        flex: 1,
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
        minWidth: scale(40),
    },
    unitDropdown: {
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
        borderLeftWidth: 1,
        borderLeftColor: "#E5E4DD",
        minWidth: scale(84),
    },
    dropdown: {
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
        height: scale(36),
        justifyContent: "center",
        minWidth: scale(120),
    },
    dropdownFocused: {
        borderWidth: 1,
        borderColor: "#234338",
    },
    dropdownPlaceholder: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#B4B2A9",
    },
    dropdownSelectedText: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    dropdownContainer: {
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: "#E5E4DD",
    },
    timingRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(6),
    },
    timingChip: {
        borderWidth: 1,
        borderColor: "#B4B2A9",
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: scale(6),
    },
    timingChipActive: {
        backgroundColor: "#23423B",
        borderColor: "#23423B",
    },
    timingChipText: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
    },
    timingChipTextActive: {
        color: "#EEF6A2",
    },
    saveButton: {
        backgroundColor: "#234338",
        borderRadius: scale(20),
        paddingVertical: scale(12),
        alignItems: "center"
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#EEF6A2",
    },
    pickerItemText: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    Spinner: {
        marginLeft: "auto",
        marginRight: "auto",
    }
});

export default AddMedicineModal;