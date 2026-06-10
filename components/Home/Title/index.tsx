import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'

type Props = {
    userName: string
    ShowStats: boolean
}

const Title: React.FC<Props> = ({ userName, ShowStats }) => {
    const formattedName = userName
        .trim()
        .replace(/\b\w/g, char => char.toUpperCase())

    const getGreeting = () => {
        const hour = new Date().getHours()

        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                {ShowStats ? `${getGreeting()} 👋` : 'Welcome 👋'}
            </Text>

            <Text style={styles.name}>
                {formattedName}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: vScale(18),
    },
    greeting: {
        fontSize: scale(16),
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
        marginBottom: vScale(4),
    },
    name: {
        fontSize: scale(28),
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
    },
})

export default Title