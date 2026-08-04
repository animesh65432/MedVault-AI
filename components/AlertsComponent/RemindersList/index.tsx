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
            <View>
                {Reminders.map((reminder) => (
                    <Reminder
                        key={reminder.Id}
                        reminder={reminder}
                        onToggle={(id, value) => {
                            // Handle toggle logic here
                        }}
                    />
                ))}
            </View>
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
        marginTop: scale(10)
    },
    UpcomingText: {
        fontSize: fs(20),
        fontFamily: "Aeonik-Medium"
    },

})
export default RemindersList