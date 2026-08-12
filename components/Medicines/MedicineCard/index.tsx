import { deleteMedicine, updateMedicine } from "@/db/medicines"
import { MedicineWithDetailsTypes } from "@/types"
import { DosageUnitOptions, DurationUnitOptions } from "@/utils/contensnt"
import { FrequencyOptions } from "@/utils/frequencyOptions"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { TimingOptions } from "@/utils/timing"
import Feather from "@expo/vector-icons/Feather"
import { router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import React, { useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import Swipeable from 'react-native-gesture-handler/Swipeable'
import MedicineTagPill from "../Medicinetagpill"
import Delete from "./Delete"


interface MedicineCardProps {
    medicine: MedicineWithDetailsTypes;
    deleteMedicineFromState: (id: number) => void;
    updateMedicineFromState: (updatedMedicine: MedicineWithDetailsTypes) => void;
}

function formatDoctorLine(medicine: MedicineWithDetailsTypes): string {
    const doctor = medicine.doctorName ? `Prescribed by ${medicine.doctorName}` : "Prescribed"
    const date = medicine.prescribedDate ? ` — ${medicine.prescribedDate}` : ""
    return `${doctor}${date}`
}

function splitValueUnit(raw: string | null | undefined): [string, string] {
    if (!raw) return ["", ""]
    const match = raw.trim().match(/^([\d.]+)\s*([a-zA-Z]+)?$/)
    if (!match) return [raw, ""]
    return [match[1] ?? "", match[2] ?? ""]
}

const MedicineCard: React.FC<MedicineCardProps> = ({
    medicine,
    deleteMedicineFromState,
    updateMedicineFromState
}) => {
    const db = useSQLiteContext()
    const [isEditable, setIsEditable] = useState(false)
    const [IsDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [name, setName] = useState(medicine.name)

    const [dosageInitialValue, dosageInitialUnit] = splitValueUnit(medicine.dosage)
    const [dosageValue, setDosageValue] = useState(dosageInitialValue)
    const [dosageUnit, setDosageUnit] = useState(dosageInitialUnit || "mg")

    const [frequency, setFrequency] = useState(medicine.frequency ?? "")

    const [durationInitialValue, durationInitialUnit] = splitValueUnit(medicine.duration)
    const [durationValue, setDurationValue] = useState(durationInitialValue)
    const [durationUnit, setDurationUnit] = useState(durationInitialUnit || "days")

    const [timings, setTimings] = useState<string[]>(medicine.timing || [])

    const hasDetails = medicine.dosage || medicine.frequency || medicine.duration

    const resetDraft = () => {
        setName(medicine.name)
        const [dv, du] = splitValueUnit(medicine.dosage)
        setDosageValue(dv)
        setDosageUnit(du || "mg")
        setFrequency(medicine.frequency ?? "")
        const [drv, dru] = splitValueUnit(medicine.duration)
        setDurationValue(drv)
        setDurationUnit(dru || "days")
    }

    const toggleTiming = (value: string) => {
        setTimings((prev) => {
            if (prev.includes(value)) {
                return prev.filter((v) => v !== value)
            } else {
                return [...prev, value]
            }
        })
    };


    const handleCancel = () => {
        resetDraft()
        setIsEditable(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteMedicine(db, medicine.Id)
        } catch (error) {
            console.error("Error deleting medicine:", error)
        } finally {
            deleteMedicineFromState(medicine.Id)
            setIsDeleting(false)
        }
    }

    const handleSave = async () => {
        if (!name.trim()) return
        setIsSaving(true)
        try {
            const updated: MedicineWithDetailsTypes = {
                ...medicine,
                name: name.trim(),
                dosage: dosageValue.trim() ? `${dosageValue.trim()}${dosageUnit}` : "",
                frequency: frequency.trim(),
                duration: durationValue.trim() ? `${durationValue.trim()} ${durationUnit}` : "",
                timing: timings,
            }

            await updateMedicine(db, updated)
            updateMedicineFromState(updated)
            setIsEditable(false)
        } catch (error) {
            console.error("Error updating medicine:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Swipeable
            overshootRight={false}
            renderRightActions={() => <Delete
                handleDelete={handleDelete}
                IsDeleting={IsDeleting}
            />}
        >
            <TouchableOpacity
                onPress={() => router.push(`/MedicineDetail/${medicine.Id}`)}
                activeOpacity={isEditable ? 1 : 0.7}
                style={styles.card}
            >
                <View style={styles.cardTop}>
                    {isEditable ? (
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.medNameInput}
                            placeholder="Medicine name"
                            placeholderTextColor="#234338"
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.medName} numberOfLines={2}>
                            {medicine.name || "Unnamed medicine"}
                        </Text>
                    )}

                    <View style={styles.actionsRow}>
                        {isEditable ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.chip, styles.chipActive]}
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    hitSlop={8}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator size="small" color="#EEF6A2" />
                                    ) : (
                                        <>
                                            <Feather name="check" size={fs(11)} color="#EEF6A2" />
                                            <Text style={[styles.chipText, styles.chipTextActive]}>Save</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={handleCancel}
                                    disabled={isSaving}
                                    hitSlop={8}
                                >
                                    <Feather name="x" size={fs(11)} color="#5F5E5A" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.chip}
                                    onPress={() => setIsEditable(true)}
                                    hitSlop={8}
                                >
                                    <Feather name="edit-2" size={fs(11)} color="#5F5E5A" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {isEditable ? (
                    <View style={styles.editBlock}>
                        <View style={styles.pillRow}>
                            <View style={styles.splitField}>
                                <TextInput
                                    value={dosageValue}
                                    onChangeText={setDosageValue}
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
                                    onChange={(item) => setDosageUnit(item.value)}
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
                                placeholder="Frequency"
                                value={frequency}
                                onChange={(item) => setFrequency(item.value)}
                            />

                            <View style={styles.splitField}>
                                <TextInput
                                    value={durationValue}
                                    onChangeText={setDurationValue}
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
                                    onChange={(item) => setDurationUnit(item.value)}
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
                    </View>
                ) : (
                    !!hasDetails && (
                        <View style={styles.pillRow}>
                            {!!medicine.dosage && <Pill text={medicine.dosage} />}
                            {!!medicine.frequency && <Pill text={medicine.frequency} />}
                            {!!medicine.duration && <Pill text={medicine.duration} />}
                            {medicine.timing.length > 0 ? <Pill text={medicine.timing.join(" , ")} /> : null}
                        </View>
                    )
                )}

                {!isEditable && (medicine.tags?.length || medicine.courseLabel) && (
                    <View style={styles.tagsRow}>
                        <View style={styles.tagsGroup}>
                            {medicine.tags?.map((tag) => (
                                <MedicineTagPill key={tag.label} tag={tag} />
                            ))}
                        </View>
                        {!!medicine.courseLabel && (
                            <Text style={styles.courseLabel}>{medicine.courseLabel}</Text>
                        )}
                    </View>
                )}
                {
                    !isEditable && formatDoctorLine(medicine).length > 0 && <View
                        style={styles.border}
                    />
                }


                {!isEditable && (
                    <Text style={styles.doctorLine} numberOfLines={1}>
                        {formatDoctorLine(medicine)}
                    </Text>
                )}
            </TouchableOpacity>
        </Swipeable>
    )
}

const Pill = ({ text }: { text: string }) => (
    <View style={styles.pill}>
        <Text style={styles.pillText}>{text}</Text>
    </View>
)

const styles = StyleSheet.create({
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
        color: "#234338",
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
    removeChip: {
        borderWidth: 1,
        borderColor: "#F0C9C5",
        backgroundColor: "#FBEEED",
        borderRadius: scale(20),
        padding: scale(6),
        flexShrink: 0,
    },
    editBlock: {
        gap: scale(8),
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
        color: "#234338",
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
    dropdown: {
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
        height: scale(26),
        justifyContent: "center",
        minWidth: scale(110),
    },
    dropdownPlaceholder: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#B4B2A9",
    },
    dropdownSelectedText: {
        fontSize: fs(11),
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
    courseLabel: {
        fontFamily: "Aeonik-Regular",
        fontSize: fs(13),
        color: "#9BAFA6",
    },
    tagsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: scale(6),
    },
    tagsGroup: {
        flexDirection: "row",
        gap: scale(6),
        flexShrink: 1,
        flexWrap: "wrap",
    },
    doctorLine: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13),
        color: "#9BAFA6",
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E4DD",
        marginVertical: scale(8),
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
    dropdownFocused: {
        borderWidth: 1,
        borderColor: "#234338",
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
})

export default MedicineCard

