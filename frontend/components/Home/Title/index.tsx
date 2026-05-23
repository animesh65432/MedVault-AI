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
            <Text style={styles.text}>
                {ShowStats ? "Hello" : "Welcome"}, {userName.replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        fontSize: scale(20),
        fontFamily: "Aeonik-Medium",
        color: "#000000",
    },
    icon: {
        marginLeft: scale(6),
    }
})

export default Title
