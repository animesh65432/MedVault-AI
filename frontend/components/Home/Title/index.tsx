import React from 'react'
import { View, Text, StyleSheet } from "react-native"
import { scale } from '@/utils/scale'

type Props = {
    userName: string,
    ShowStats: boolean,
}

const Title: React.FC<Props> = ({ userName, ShowStats }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{ShowStats ? "Hello" : "Welcome"}, {userName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: "100%",
        margin: 0,
        justifyContent: "flex-start"
    },
    text: {
        fontSize: scale(20),
        fontFamily: "Aeonik-Medium",
    }
})

export default Title