import React from 'react'
import { View, Text } from "react-native"
import { StatsInformation } from '@/types'

interface StatsProps {
    statsInformation: StatsInformation;
}

const Stats: React.FC<StatsProps> = ({ statsInformation }) => {
    return (
        <View>
            <Text>Stats</Text>
        </View>
    )
}

export default Stats