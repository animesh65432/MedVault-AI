import { ReminderWithMedicine } from '@/types'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Reminder from './Reminder'


type Props = {
    Reminders: ReminderWithMedicine[]
}

const RemindersList: React.FC<Props> = ({ Reminders }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.UpcomingText}>Upcoming</Text>
            {Reminders.map((reminder) => (
                <Reminder
                    key={reminder.Id}
                    reminder={reminder}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: scale(10),
        paddingHorizontal: scale(20),
    },
    UpcomingText: {
        fontSize: fs(18),
        fontFamily: "Aeonik-Medium"
    }
})
export default RemindersList