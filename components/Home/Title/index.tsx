import { UserNameContext } from '@/context/UserName'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    DocumentCount: number;
}

const Title: React.FC<Props> = ({ DocumentCount }) => {
    const { userName } = useContext(UserNameContext)

    const firstName = userName?.trim().split(/\s+/)[0] ?? ''

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return `Good Morning ${firstName}`
        if (hour < 17) return `Good Afternoon ${firstName}`
        return `Good Evening ${firstName}`
    }

    return (
        <View style={styles.container}>
            <Text
                style={styles.greeting}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
            >
                {DocumentCount === 0 ? `Welcome ${firstName} 👋` : `${getGreeting()} 👋`}
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