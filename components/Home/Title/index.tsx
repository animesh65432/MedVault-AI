import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    DocumentCount: number;
}


const Title: React.FC<Props> = ({ DocumentCount }) => {

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                {DocumentCount === 0 ? "Welcome 👋" : `${getGreeting()} 👋`}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: vScale(3),
    },
    greeting: {
        fontSize: scale(18),
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
        marginBottom: vScale(4),
    },
})

export default Title