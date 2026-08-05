import { ReminderWithMedicine } from '@/types';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Delete from './Delete';

type Props = {
    reminder: ReminderWithMedicine;
    onToggle: (id: number, value: boolean) => void;
    OnDeleteReminder: (id: number) => Promise<void>;
};

const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    if (hours === 0) hours = 12;
    const clock = `${hours}:${minutes.toString().padStart(2, '0')}`;

    return { period, clock };
};

const REPEAT_LABELS: Record<string, string> = {
    once: 'As needed',
    daily: 'Daily',
    weekly: 'Weekly',
};

const Reminder: React.FC<Props> = ({ OnDeleteReminder, reminder, onToggle }) => {
    const { period, clock } = formatTime(reminder.time);
    return (
        <Swipeable
            overshootRight={false}
            renderRightActions={() => <Delete
                id={reminder.Id}
                OnDeleteReminder={OnDeleteReminder}
            />}
        >
            <View
                style={styles.container}
            >
                <View style={styles.timeBadge}>
                    <Text style={styles.period}>{period}</Text>
                    <Text style={styles.clock}>{clock}</Text>
                </View>

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>
                        {reminder.medicineName}
                    </Text>
                    <Text style={styles.subtext} numberOfLines={1}>
                        {reminder.dosage ? `${reminder.dosage}` : ''}
                        {reminder.dosage && reminder.title ? ' · ' : ''}
                        {reminder.title}
                    </Text>
                </View>

                <View style={styles.rightCol}>
                    <View style={styles.repeatChip}>
                        <Text style={styles.repeatChipText}>
                            {REPEAT_LABELS[reminder.repeat] ?? reminder.repeat}
                        </Text>
                    </View>
                    <Switch
                        value={!!reminder.IsEnabled}
                        onValueChange={(value) => onToggle(reminder.Id, value)}
                        trackColor={{ false: '#DCE3DF', true: '#234338' }}
                        thumbColor="#FAFAF8"
                        style={styles.switch}
                    />
                </View>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAF8',
        borderRadius: scale(16),
        paddingVertical: vScale(12),
        paddingHorizontal: scale(12),
        marginBottom: vScale(10),
        shadowColor: '#0D1F1C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    timeBadge: {
        display: "flex",
        flexDirection: "column",
        borderRadius: scale(12),
        backgroundColor: '#EEF3F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
        padding: scale(8),
        gap: vScale(2),
    },
    period: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(13),
        color: '#8A968F',
    },
    clock: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(14),
        color: '#0D1F1C',
    },
    info: {
        flex: 1,
    },
    title: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(14.5),
        color: '#0D1F1C',
    },
    subtext: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(12),
        color: '#8A968F',
        marginTop: vScale(2),
    },
    rightCol: {
        alignItems: 'flex-end',
        gap: vScale(8),
    },
    repeatChip: {
        backgroundColor: '#0D483F',
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: vScale(3),
    },
    repeatChipText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(10),
        color: 'white',
    },
    switch: {
        transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
    },
});

export default Reminder;