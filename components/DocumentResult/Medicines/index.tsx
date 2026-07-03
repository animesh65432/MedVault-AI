import { Medicine as MedicineType } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AddMedicineModal from "../AddMedicineModel";

type Props = {
    medicines: MedicineType[];
    activeReminders: Set<number>;
    onToggleReminder: (index: number, medicine: MedicineType) => void;
    isEditable: boolean;
    onUpdateMedicine?: (index: number, field: keyof MedicineType, value: string) => void;
    onRemoveMedicine?: (index: number) => void;
};

const Medicines: React.FC<Props> = ({
    medicines,
    activeReminders,
    onToggleReminder,
    isEditable,
    onUpdateMedicine,
    onRemoveMedicine,
}) => {
    const [isAddMedicineModalVisible, setAddMedicineModalVisible] = useState(false);

    if (medicines.length === 0 && !isEditable) return null;

    const onAddMedicine = () => {
        setAddMedicineModalVisible(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <View style={styles.titleLeft}>
                    <Text style={styles.title}>Medicines</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{medicines.length}</Text>
                    </View>
                </View>
                {isEditable && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddMedicine}
                        hitSlop={8}
                    >
                        <Feather name="plus" size={fs(13)} color="#234338" />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.list}>
                {medicines.map((med, index) => {
                    const hasDetails =
                        med.dosage || med.frequency || med.duration || med.timing;
                    const isActive = activeReminders.has(index);

                    return (
                        <View key={`${med.name}-${index}`} style={styles.card}>
                            <View style={styles.cardTop}>
                                {isEditable ? (
                                    <TextInput
                                        value={med.name}
                                        onChangeText={(text) => onUpdateMedicine?.(index, "name", text)}
                                        style={styles.medNameInput}
                                        placeholder="Medicine name"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                ) : (
                                    <Text style={styles.medName} numberOfLines={2}>
                                        {med.name || "Unnamed medicine"}
                                    </Text>
                                )}

                                {isEditable ? (
                                    <TouchableOpacity
                                        style={styles.removeChip}
                                        onPress={() => onRemoveMedicine?.(index)}
                                        hitSlop={8}
                                    >
                                        <Feather name="trash-2" size={fs(13)} color="#B3261E" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.chip, isActive && styles.chipActive]}
                                        onPress={() => onToggleReminder(index, med)}
                                        hitSlop={8}
                                    >
                                        <Octicons
                                            name={isActive ? "bell-fill" : "bell"}
                                            size={fs(11)}
                                            color={isActive ? "#EEF6A2" : "#5F5E5A"}
                                        />
                                        <Text
                                            style={[
                                                styles.chipText,
                                                isActive && styles.chipTextActive,
                                            ]}
                                        >
                                            {isActive ? "Set" : "Remind"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isEditable ? (
                                <View style={styles.pillRow}>
                                    <PillInput
                                        value={med.dosage}
                                        placeholder="Dosage"
                                        onChangeText={(text) => onUpdateMedicine?.(index, "dosage", text)}
                                    />
                                    <PillInput
                                        value={med.frequency}
                                        placeholder="Frequency"
                                        onChangeText={(text) => onUpdateMedicine?.(index, "frequency", text)}
                                    />
                                    <PillInput
                                        value={med.duration}
                                        placeholder="Duration"
                                        onChangeText={(text) => onUpdateMedicine?.(index, "duration", text)}
                                    />
                                    <PillInput
                                        value={med.timing}
                                        placeholder="Timing"
                                        onChangeText={(text) => onUpdateMedicine?.(index, "timing", text)}
                                    />
                                </View>
                            ) : (
                                !!hasDetails && (
                                    <View style={styles.pillRow}>
                                        {!!med.dosage && <Pill text={med.dosage} />}
                                        {!!med.frequency && <Pill text={med.frequency} />}
                                        {!!med.duration && <Pill text={med.duration} />}
                                        {!!med.timing && <Pill text={med.timing} />}
                                    </View>
                                )
                            )}
                        </View>
                    );
                })}
            </View>
            {isAddMedicineModalVisible
                &&
                <AddMedicineModal
                    isMedicineModalVisible={isAddMedicineModalVisible}
                    setMedicineModalIsVisible={setAddMedicineModalVisible}
                />
            }
        </View>
    );
};

const Pill = ({ text }: { text: string }) => (
    <View style={styles.pill}>
        <Text style={styles.pillText}>{text}</Text>
    </View>
);

const PillInput = ({
    value,
    placeholder,
    onChangeText,
}: {
    value?: string;
    placeholder: string;
    onChangeText: (text: string) => void;
}) => (
    <View style={styles.pillInputWrap}>
        <TextInput
            value={value ?? ""}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#B4B2A9"
            style={styles.pillInput}
        />
    </View>
);

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
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
        borderWidth: 1,
        borderColor: "#234338",
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
    },
    addButtonText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    list: {
        gap: scale(8),
    },
    card: {
        backgroundColor: "#FAFAF8",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(12),
        padding: scale(12),
        gap: scale(8),
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: scale(8),
    },
    medName: {
        fontSize: fs(13.5),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        flex: 1,
    },
    medNameInput: {
        fontSize: fs(13.5),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        flex: 1,
        padding: 0,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
        borderWidth: 1,
        borderColor: "#B4B2A9",
        borderRadius: scale(20),
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        flexShrink: 0,
    },
    chipActive: {
        backgroundColor: "#23423B",
        borderColor: "#23423B",
    },
    chipText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
    },
    chipTextActive: {
        color: "#EEF6A2",
    },
    removeChip: {
        borderWidth: 1,
        borderColor: "#F0C9C5",
        backgroundColor: "#FBEEED",
        borderRadius: scale(20),
        padding: scale(6),
        flexShrink: 0,
    },
    pillRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(6),
    },
    pill: {
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
    },
    pillText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
    },
    pillInputWrap: {
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
        minWidth: scale(64),
    },
    pillInput: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
        padding: 0,
    },
});

export default Medicines;