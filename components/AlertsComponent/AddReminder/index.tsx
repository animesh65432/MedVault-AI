import { CrateReminder } from '@/db/alerts';
import { ReminderRepeat, ReminderWithMedicine } from '@/types';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Feather from '@expo/vector-icons/Feather';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import Toast from 'react-native-toast-message';
import { Medicine } from '../Medicines/Medicine';

type Props = {
    medicine: Medicine;
    onBack: () => void;
    onSaved: (reminderwithmedicine: ReminderWithMedicine) => void;
};

const REPEATS: { key: ReminderRepeat; label: string }[] = [
    { key: 'once', label: 'Once' },
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
];

const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const AddReminder: React.FC<Props> = ({ medicine, onBack, onSaved }) => {
    const db = useSQLiteContext();
    const [title, setTitle] = useState(medicine.name);
    const [time, setTime] = useState(new Date());
    const [repeat, setRepeat] = useState<ReminderRepeat>('daily');
    const [showPicker, setShowPicker] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const trimmed = title.trim();
        if (!trimmed) {
            Toast.show({ type: 'error', text2: 'Please provide a title.' });
            return;
        }
        try {
            setSaving(true);
            const reminderId = await CrateReminder(db, {
                MedicineId: medicine.Id,
                title: trimmed,
                time,
                repeat,
            });

            if (!reminderId) {
                Toast.show({ type: 'error', text2: 'Could not save reminder.' });
                return;
            }

            Toast.show({ type: 'success', text2: 'Reminder added.' });

            onSaved({
                Id: reminderId,
                MedicineId: medicine.Id,
                title: trimmed,
                time: time.toISOString(),
                repeat,
                medicineName: medicine.name,
                dosage: medicine.dosage,
                frequency: medicine.frequency
            });

        } catch (error) {
            console.error('Error saving reminder:', error);
            Toast.show({ type: 'error', text2: 'Could not save reminder.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} hitSlop={12} style={styles.backBtn}>
                    <Feather name="chevron-left" size={20} color="#234338" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Set Reminder</Text>
                <View style={{ width: scale(32) }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vScale(24) }}>
                <View style={styles.medicineChip}>
                    <Feather name="clipboard" size={14} color="#234338" />
                    <Text style={styles.medicineChipText}>{medicine.name}</Text>
                </View>

                <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>Title</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Reminder title"
                        placeholderTextColor="#B4B2A9"
                        style={styles.nameInput}
                    />
                </View>

                <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>Time</Text>
                    <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.8}
                    >
                        <Feather name="clock" size={14} color="#234338" />
                        <Text style={styles.timeButtonText}>{formatTime(time)}</Text>
                    </TouchableOpacity>

                    <TimerPickerModal
                        use12HourPicker
                        initialValue={{
                            hours: time.getHours(),
                            minutes: time.getMinutes(),
                            seconds: 0,
                        }}
                        visible={showPicker}
                        setIsVisible={setShowPicker}
                        onConfirm={({ hours, minutes }) => {
                            const updated = new Date();
                            updated.setHours(hours, minutes);
                            setTime(updated);
                            setShowPicker(false);
                        }}
                        onCancel={() => setShowPicker(false)}
                        hideSeconds
                        styles={{
                            theme: 'light',
                            backgroundColor: '#FAFAF8',
                            pickerItem: { fontFamily: 'Aeonik-Medium', color: '#0D1F1C' },
                            pickerLabel: { color: '#5F5E5A' },
                            pickerAmPmLabel: { fontFamily: 'Aeonik-Medium', color: '#234338' },
                            confirmButton: { backgroundColor: '#234338', color: 'white' },
                            pickerColumnWidth: scale(130),
                        }}
                    />
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
                                    <Text style={[styles.freqChipText, active && styles.freqChipTextActive]}>
                                        {r.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, (!title.trim() || saving) && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!title.trim() || saving}
                    activeOpacity={0.85}
                >
                    <Text style={styles.saveButtonText}>
                        {saving ? 'Saving...' : 'Save Reminder'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: scale(16) },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vScale(10),
    },
    backBtn: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#FAFAF8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(17),
        color: '#0D1F1C',
    },
    medicineChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        alignSelf: 'flex-start',
        backgroundColor: '#EEF6A2',
        borderRadius: scale(20),
        paddingHorizontal: scale(12),
        paddingVertical: vScale(6),
        marginBottom: vScale(16),
    },
    medicineChipText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(12.5),
        color: '#0D1F1C',
    },
    fieldWrap: {
        gap: scale(6),
        marginBottom: vScale(16),
    },
    fieldLabel: {
        fontSize: fs(10),
        fontFamily: 'Aeonik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        color: '#5F5E5A',
    },
    nameInput: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
        borderWidth: 1,
        borderColor: '#E5E4DD',
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        backgroundColor: '#FAFAF8',
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: '#F1EFE8',
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        alignSelf: 'flex-start',
    },
    timeButtonText: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Medium',
        color: '#234338',
    },
    freqRow: {
        flexDirection: 'row',
        gap: scale(8),
    },
    freqChip: {
        borderWidth: 1,
        borderColor: '#B4B2A9',
        borderRadius: scale(20),
        paddingHorizontal: scale(14),
        paddingVertical: scale(6),
    },
    freqChipActive: {
        backgroundColor: '#23423B',
        borderColor: '#23423B',
    },
    freqChipText: {
        fontSize: fs(12),
        fontFamily: 'Aeonik-Medium',
        color: '#5F5E5A',
    },
    freqChipTextActive: {
        color: '#EEF6A2',
    },
    footer: {
        paddingBottom: vScale(40),
        paddingTop: vScale(8),
    },
    saveButton: {
        backgroundColor: '#234338',
        borderRadius: scale(20),
        paddingVertical: scale(14),
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Medium',
        color: '#EEF6A2',
    },
});

export default AddReminder;

