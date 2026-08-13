import { ReminderRowDB } from "@/db/medicines"
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Reminder from './Reminder'

type Props = {
    reminders: ReminderRowDB[],
    medicineName: string,
    dosage: string | null,
    handleDeleteReminder: (id: number) => Promise<void>,
    onToggle: (id: number, value: boolean) => void;
}

const Reminders: React.FC<Props> = ({ onToggle, handleDeleteReminder, reminders, medicineName, dosage }) => {
    if (!reminders || reminders.length === 0) return null

    return (
        <View style={style.Container}>
            <Text style={style.sectionTitle}>Active reminders</Text>
            <View style={style.reminderList}>
                {reminders.map((reminder) => (
                    <Reminder
                        onToggle={onToggle}
                        key={reminder.Id}
                        reminder={reminder}
                        medicineName={medicineName}
                        dosage={dosage}
                        OnDeleteReminder={handleDeleteReminder}
                    />
                ))}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        paddingHorizontal: scale(20),
        gap: scale(4),
    },
    sectionTitle: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        color: "#234338",
        marginBottom: scale(4),
    },
    reminderList: {
        display: "flex",
        flexDirection: "column",
        gap: scale(8),
    }
})

export default Reminders