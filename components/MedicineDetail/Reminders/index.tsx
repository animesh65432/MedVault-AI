import { ReminderRowDB } from "@/db/medicines"
import React from 'react'
import { View } from 'react-native'

type Props = {
    reminders: ReminderRowDB[]
}

const Reminders: React.FC<Props> = ({ reminders }) => {
    console.log("Reminders:", reminders)
    return (
        <View></View>
    )
}

export default Reminders