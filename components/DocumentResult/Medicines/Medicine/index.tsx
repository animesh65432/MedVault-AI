import { Medicine as MedicineType } from "@/types";
import { DosageUnitOptions, DurationUnitOptions } from "@/utils/contensnt";
import { FrequencyOptions } from "@/utils/frequencyOptions";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { TimingOptions } from "@/utils/timing";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Pill } from "../index";

type Props = {
    med: MedicineType;
    hasDetails: boolean;
    hasReminders: boolean;
    isEditable: boolean;
    index: number;
    onUpdateMedicine: (index: number, field: keyof MedicineType, value: string | string[]) => void;
    onRemoveMedicine: (index: number) => void;
    onAddMedicine: (medicine: MedicineType) => void;
    onToogleReminderModal: (index: number) => void;
}

const Medicine: React.FC<Props> = ({ onToogleReminderModal, onRemoveMedicine, onAddMedicine, onUpdateMedicine, index, isEditable, med, hasDetails, hasReminders }) => {
    const [dosageValue, setDosageValue] = useState(med.dosage ? med.dosage.split(" ")[0] : "");
    const [dosageUnit, setDosageUnit] = useState(med.dosage ? med.dosage.split(" ")[1] : DosageUnitOptions[0].value);
    const [durationValue, setDurationValue] = useState(med.duration ? med.duration.split(" ")[0] : "");
    const [durationUnit, setDurationUnit] = useState(med.duration ? med.duration.split(" ")[1] : DurationUnitOptions[0].value);
    const [timings, setTimings] = useState<string[]>(med.timing || []);
    const [isFrequencyFocus, setIsFrequencyFocus] = useState(false);

    const toggleTiming = (timing: string) => {
        if (timings.includes(timing)) {
            setTimings(timings.filter((t) => t !== timing));
            onUpdateMedicine(index, "timing", timings.filter((t) => t !== timing));
        } else {
            setTimings([...timings, timing]);
            onUpdateMedicine(index, "timing", [...timings, timing]);
        }
    };
    return (
        <View key={med.name ? `${med.name}-${index}` : index} style={styles.card}>
            <View style={styles.cardTop}>
                {isEditable ? (
                    <TextInput
                        value={med.name}
                        onChangeText={(text) => onUpdateMedicine(index, "name", text)}
                        style={styles.medNameInput}
                        placeholder="Medicine name"
                        placeholderTextColor="#B4B2A9"
                    />
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="pill"
                            size={scale(18)}
                            color="#23423B"
                        />

                        <Text style={styles.medName} numberOfLines={2}>
                            {med.name || "Unnamed medicine"}
                        </Text>
                    </>
                )}

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.chip, hasReminders && styles.chipActive]}
                        onPress={() => onToogleReminderModal(index)}
                        hitSlop={8}
                    >
                        <AntDesign
                            name={hasReminders ? "bell" : "clock-circle"}
                            size={fs(14)}
                            color={hasReminders ? "#EEF6A2" : "#5F5E5A"}
                        />
                        {hasReminders && (
                            <View style={styles.chipCountBadge}>
                                <Text style={styles.chipCountText}>{med.reminders.length}</Text>
                            </View>
                        )}
                        <Text
                            style={[
                                styles.chipText,
                                hasReminders && styles.chipTextActive,
                            ]}
                        >
                            {hasReminders ? "Reminders" : "Set"}
                        </Text>
                    </TouchableOpacity>

                    {isEditable && (
                        <TouchableOpacity
                            style={styles.removeChip}
                            onPress={() => onRemoveMedicine?.(index)}
                            hitSlop={8}
                        >
                            <Feather name="trash-2" size={fs(13)} color="#B3261E" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isEditable ? (
                <View style={styles.pillRow}>
                    <View style={styles.splitField}>
                        <TextInput
                            value={dosageValue}
                            onChangeText={(text) => {
                                setDosageValue(text);
                                onUpdateMedicine(index, "dosage", `${text} ${dosageUnit}`.trim());
                            }}
                            placeholder="Dosage"
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
                            value={dosageUnit}
                            onChange={(item) => {
                                setDosageUnit(item.value);
                                onUpdateMedicine(index, "dosage", `${dosageValue} ${item.value}`.trim());
                            }}
                        />
                    </View>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelectedText}
                        itemTextStyle={styles.pickerItemText}
                        containerStyle={styles.dropdownContainer}
                        data={FrequencyOptions as unknown as { label: string; value: string }[]}
                        maxHeight={220}
                        labelField="label"
                        valueField="value"
                        placeholder="Select"
                        value={med.frequency}
                        onFocus={() => setIsFrequencyFocus(true)}
                        onBlur={() => setIsFrequencyFocus(false)}
                        onChange={(item) => {
                            onUpdateMedicine?.(index, "frequency", item.value)
                            setIsFrequencyFocus(false);
                        }}
                    />
                    <View style={styles.splitField}>
                        <TextInput
                            value={durationValue}
                            onChangeText={(text) => {
                                setDurationValue(text);
                                onUpdateMedicine(index, "duration", `${text} ${durationUnit}`.trim());
                            }}
                            placeholder="Duration"
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
                            value={durationUnit}
                            onChange={(item) => {
                                setDurationUnit(item.value);
                                onUpdateMedicine(index, "duration", `${durationValue} ${item.value}`.trim());
                            }}
                        />
                    </View>
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Timing</Text>
                        <View style={styles.timingRow}>
                            {(TimingOptions as unknown as { label: string; value: string }[]).map((opt) => {
                                const active = timings.includes(opt.value)
                                return (
                                    <TouchableOpacity
                                        key={opt.value}
                                        onPress={() => toggleTiming(opt.value)}
                                        style={[styles.timingChip, active && styles.timingChipActive]}
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
                </View>
            ) : (
                !!hasDetails && (
                    <View style={styles.pillRow}>
                        {!!med.dosage && <Pill text={med.dosage} />}
                        {!!med.frequency && <Pill text={med.frequency} />}
                        {!!med.duration && <Pill text={med.duration} />}
                        {!!med.timing && med.timing.length > 0 && <Pill text={med.timing.join(", ")} />}
                    </View>
                )
            )}
        </View>
    )
}
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
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6),
        flexShrink: 0,
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
    chipCountBadge: {
        backgroundColor: "#EEF6A2",
        borderRadius: scale(8),
        paddingHorizontal: scale(5),
        minWidth: scale(15),
        alignItems: "center",
    },
    chipCountText: {
        fontSize: fs(10),
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
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
        backgroundColor: "#EDF2F1",
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
    dropdown: {
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
        height: scale(26),
        justifyContent: "center",
        minWidth: scale(110),
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
    pickerItemText: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    rowtitle: {
        display: "flex",
        flexDirection: "row"
    },
    splitField: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        overflow: "hidden",
        minWidth: scale(96),
    },
    splitFieldInput: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
        minWidth: scale(36),
    },
    unitDropdown: {
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
        borderLeftWidth: 1,
        borderLeftColor: "#E5E4DD",
        minWidth: scale(86),
    },
    fieldWrap: {
        display: "flex",
        flexDirection: "column",
        gap: scale(4),
    },
    fieldLabel: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color: "#5F5E5A",
        marginTop: scale(4)
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
        paddingVertical: scale(2),
    },
    timingChipActive: {
        backgroundColor: "#23423B",
        borderColor: "#23423B",
    },
    timingChipText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
    },
    timingChipTextActive: {
        color: "#EEF6A2",
    },
});


export default Medicine