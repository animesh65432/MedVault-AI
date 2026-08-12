import { MedicineReminder } from '@/types';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    reminder: MedicineReminder;
    MedicineName: string;
    onTakeNow: (reminder: MedicineReminder) => void;
    onSnooze: (reminder: MedicineReminder) => void;
};

const formatTime = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const DosageCard: React.FC<Props> = ({ reminder, MedicineName, onTakeNow, onSnooze }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MaterialCommunityIcons name="bell-ring" size={scale(16)} color="#EEF6A2" />
                    <Text style={styles.label}>Next dose</Text>
                </View>
                <Text style={styles.time}>{formatTime(reminder.time)}</Text>
            </View>

            <Text style={styles.message}>
                It's time for your dose of {MedicineName}.
            </Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.takeButton}
                    onPress={() => onTakeNow?.(reminder)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.takeButtonText}>Take now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.snoozeButton}
                    onPress={() => onSnooze?.(reminder)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.snoozeButtonText}>Snooze</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#234338',
        borderRadius: scale(16),
        padding: scale(16),
        gap: vScale(12),
        marginHorizontal: scale(16),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
    },
    label: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        color: '#EEF6A2',
    },
    time: {
        fontSize: fs(20),
        fontFamily: 'Aeonik-Medium',
        color: '#FFFFFF',
    },
    message: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Regular',
        color: '#C9D9CE',
        lineHeight: fs(18),
    },
    actions: {
        flexDirection: 'row',
        gap: scale(8),
    },
    takeButton: {
        flex: 1,
        backgroundColor: '#EEF6A2',
        borderRadius: scale(10),
        paddingVertical: scale(10),
        alignItems: 'center',
    },
    takeButtonText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
    },
    snoozeButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: scale(10),
        paddingVertical: scale(10),
        alignItems: 'center',
    },
    snoozeButtonText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: '#FFFFFF',
    },
});

export default DosageCard;