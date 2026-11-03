import { UserNameContext } from '@/context/UserName'
import { fs } from '@/utils/fs'
import { vScale } from '@/utils/vScale'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const HeroSection: React.FC = () => {
    const { userName } = useContext(UserNameContext)
    return (
        <View style={styles.Container}>
            <Text style={styles.title}>Hello,{userName}!👋</Text>
            <View>
                <Text style={styles.subtitle}>How can i help with your</Text>
                <Text style={styles.subtitle}>health today?</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(4),
    },
    title: {
        fontFamily: "Aeonik-Bold",
        fontSize: fs(34),
        color: "black",
    },
    subtitle: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(22),
        color: "black",
    }
})

export default HeroSection