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

export type ReminderFrequency = "once" | "daily" | "weekly";

export type Reminder = {
    title: string;
    time: Date;
    frequency: ReminderFrequency;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (reminder: Reminder) => void;
    initialTitle?: string;
};

const FREQUENCIES: { key: ReminderFrequency; label: string }[] = [
    { key: "once", label: "Once" },
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
];

const AddReminderModel: React.FC<Props> = ({ visible, onClose, onAdd, initialTitle }) => {
    const [title, setTitle] = useState(initialTitle ?? "");
    const [time, setTime] = useState(new Date());
    const [frequency, setFrequency] = useState<ReminderFrequency>("daily");
    const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

    const close = () => {
        setTitle(initialTitle ?? "");
        setTime(new Date());
        setFrequency("daily");
        onClose();
    };

    const handleSave = () => {
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd({ title: trimmed, time, frequency });
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
                        <Text style={styles.fieldLabel}>Time</Text>
                        {Platform.OS === "android" && (
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={() => setShowPicker(true)}
                            >
                                <Feather name="clock" size={fs(13)} color="#234338" />
                                <Text style={styles.timeButtonText}>
                                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </Text>
                            </TouchableOpacity>
                        )}
                        {showPicker && (
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={(_, selected) => {
                                    if (Platform.OS === "android") setShowPicker(false);
                                    if (selected) setTime(selected);
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Repeat</Text>
                        <View style={styles.freqRow}>
                            {FREQUENCIES.map((f) => {
                                const active = frequency === f.key;
                                return (
                                    <TouchableOpacity
                                        key={f.key}
                                        style={[styles.freqChip, active && styles.freqChipActive]}
                                        onPress={() => setFrequency(f.key)}
                                    >
                                        <Text
                                            style={[
                                                styles.freqChipText,
                                                active && styles.freqChipTextActive,
                                            ]}
                                        >
                                            {f.label}
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
                        <Text style={styles.saveButtonText}>Add Reminder</Text>
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