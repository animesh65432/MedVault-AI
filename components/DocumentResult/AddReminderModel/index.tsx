import { Reminder, ReminderRepeat } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (reminder: Reminder) => void;
    initialTitle: string;
    initialReminders?: Reminder[];
};

const REPEATS: { key: ReminderRepeat; label: string }[] = [
    { key: "once", label: "Once" },
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
];

const MAX_TIMES = 6;

const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AddReminderModel: React.FC<Props> = ({
    visible,
    onClose,
    onAdd,
    initialTitle,
    initialReminders = [],
}) => {
    const [title, setTitle] = useState(initialTitle ?? "");
    const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
    const [repeat, setRepeat] = useState<ReminderRepeat>("daily");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const reset = () => {
        setTitle(initialTitle ?? "");
        setReminders(initialReminders.length ? initialReminders : []);
        setRepeat("daily");
        setEditingIndex(null);
    };

    const close = () => {
        reset();
        onClose();
    };

    const handleTimeChange = (index: number, selected?: Date) => {
        if (Platform.OS === "android") setEditingIndex(null);
        if (!selected) return;
        setReminders((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], time: selected };
            return next;
        });
    };

    const addTimeSlot = () => {
        if (reminders.length >= MAX_TIMES) return;
        const last = reminders.length
            ? reminders[reminders.length - 1].time
            : new Date();
        const next = new Date(last);
        next.setHours(next.getHours() + 4);

        setReminders((prev) => [
            ...prev,
            { title: title.trim() || initialTitle, time: next, repeat },
        ]);
        setEditingIndex(reminders.length);
    };

    const removeTimeSlot = (index: number) => {
        setReminders((prev) => prev.filter((_, i) => i !== index));
        if (editingIndex === index) setEditingIndex(null);
    };

    const handleSave = () => {
        const trimmed = title.trim();

        if (!trimmed || reminders.length === 0) {
            Toast.show({
                type: "error",
                text2: "Please provide a title and at least one time.",
            });
            return;
        }

        reminders.forEach((r) => {
            onAdd({ title: trimmed, time: r.time, repeat });
        });

        close();
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <Pressable style={styles.backdrop} onPress={close}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Reminder</Text>
                        <TouchableOpacity onPress={close} hitSlop={8}>
                            <Feather name="x" size={fs(18)} color="#5F5E5A" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Reminder title"
                        placeholderTextColor="#B4B2A9"
                        style={styles.nameInput}
                        autoFocus
                    />

                    <View style={styles.fieldWrap}>
                        <View style={styles.timesHeader}>
                            <Text style={styles.fieldLabel}>Times</Text>
                            {reminders.length < MAX_TIMES && (
                                <TouchableOpacity onPress={addTimeSlot} hitSlop={8} style={styles.addTimeButton}>
                                    <Feather name="plus" size={fs(12)} color="#234338" />
                                    <Text style={styles.addTimeText}>Add time</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.timesList}>
                            {reminders.map((t, i) => (
                                <View key={i} style={styles.timeRow}>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => setEditingIndex(i)}
                                    >
                                        <Feather name="clock" size={fs(13)} color="#234338" />
                                        <Text style={styles.timeButtonText}>{formatTime(t.time)}</Text>
                                    </TouchableOpacity>

                                    {reminders.length > 1 && (
                                        <TouchableOpacity
                                            style={styles.removeTimeButton}
                                            onPress={() => removeTimeSlot(i)}
                                            hitSlop={8}
                                        >
                                            <Feather name="x" size={fs(12)} color="#B3261E" />
                                        </TouchableOpacity>
                                    )}

                                    {editingIndex === i && (
                                        <DateTimePicker
                                            value={t.time}
                                            mode="time"
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            onChange={(_, selected) => handleTimeChange(i, selected)}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Repeat</Text>
                        <View style={styles.freqRow}>
                            {REPEATS.map((r) => {
                                const active = repeat === r.key;
                                return (
                                    <TouchableOpacity
                                        key={r.key}
                                        style={[styles.freqChip, active && styles.freqChipActive]}
                                        onPress={() => setRepeat(r.key)}
                                    >
                                        <Text
                                            style={[
                                                styles.freqChipText,
                                                active && styles.freqChipTextActive,
                                            ]}
                                        >
                                            {r.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!title.trim()}
                    >
                        <Text style={styles.saveButtonText}>
                            Add Reminder{reminders.length > 1 ? ` (${reminders.length} times)` : ""}
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
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        padding: scale(16),
        gap: scale(14),
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
    fieldWrap: {
        gap: scale(6),
    },
    fieldLabel: {
        fontSize: fs(10),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color: "#5F5E5A",
    },
    timesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addTimeButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
    },
    addTimeText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    timesList: {
        gap: scale(8),
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
    },
    timeButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6),
        backgroundColor: "#F1EFE8",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        alignSelf: "flex-start",
    },
    timeButtonText: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    removeTimeButton: {
        borderWidth: 1,
        borderColor: "#F0C9C5",
        backgroundColor: "#FBEEED",
        borderRadius: scale(20),
        padding: scale(6),
    },
    freqRow: {
        flexDirection: "row",
        gap: scale(8),
    },
    freqChip: {
        borderWidth: 1,
        borderColor: "#B4B2A9",
        borderRadius: scale(20),
        paddingHorizontal: scale(14),
        paddingVertical: scale(6),
    },
    freqChipActive: {
        backgroundColor: "#23423B",
        borderColor: "#23423B",
    },
    freqChipText: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
    },
    freqChipTextActive: {
        color: "#EEF6A2",
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

export default AddReminderModel;