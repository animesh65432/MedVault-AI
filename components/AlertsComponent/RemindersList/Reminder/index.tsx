import { ReminderWithMedicine } from '@/types'
import React from 'react'
import { View } from 'react-native'

type Props = {
    reminder: ReminderWithMedicine
}

const Reminder: React.FC<Props> = ({ reminder }) => {
    return (
        <View></View>
    )
}

export default Reminder