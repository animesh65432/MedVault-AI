import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { View, StyleSheet, Text } from "react-native"

const Steps: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>What can you Upload</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    titleText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(19),
        color: '#111',
        textAlign: 'center',
        lineHeight: vScale(26),
    },


})

export default Steps