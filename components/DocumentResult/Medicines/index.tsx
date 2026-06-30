import { Medicine as MedicineType } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    medicines: MedicineType[];
    onReminderToggled?: (
        index: number,
        medicine: MedicineType,
        isNowActive: boolean
    ) => void;
};

const Medicines: React.FC<Props> = ({ medicines, onReminderToggled }) => {
    const [activeReminders, setActiveReminders] = useState<Set<number>>(
        () => new Set()
    );

    if (medicines.length === 0) return null;

    const handleToggle = (index: number, medicine: MedicineType) => {
        setActiveReminders((prev) => {
            const next = new Set(prev);
            const willBeActive = !next.has(index);
            if (willBeActive) {
                next.add(index);
            } else {
                next.delete(index);
            }
            onReminderToggled?.(index, medicine, willBeActive);
            return next;
        });
    };

    console.log(medicines);
    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>Medicines</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{medicines.length}</Text>
                </View>
            </View>

            <View style={styles.list}>
                {medicines.map((med, index) => {
                    const hasDetails =
                        med.dosage || med.frequency || med.duration || med.timing;
                    const isActive = activeReminders.has(index);

                    return (
                        <View key={`${med.name}-${index}`} style={styles.card}>
                            <View style={styles.cardTop}>
                                <Text style={styles.medName} numberOfLines={2}>
                                    {med.name || "Unnamed medicine"}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.chip, isActive && styles.chipActive]}
                                    onPress={() => handleToggle(index, med)}
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
                            </View>

                            {!!hasDetails && (
                                <View style={styles.pillRow}>
                                    {!!med.dosage && <Pill text={med.dosage} />}
                                    {!!med.frequency && <Pill text={med.frequency} />}
                                    {!!med.duration && <Pill text={med.duration} />}
                                    {!!med.timing && <Pill text={med.timing} />}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const Pill = ({ text }: { text: string }) => (
    <View style={styles.pill}>
        <Text style={styles.pillText}>{text}</Text>
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
});

export default Medicines;