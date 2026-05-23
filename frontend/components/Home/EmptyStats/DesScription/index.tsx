import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { View, StyleSheet, Text } from "react-native"

const Description = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>
                Your medical history{"\n"}starts here.
            </Text>
            <Text style={styles.descriptionText}>
                Add your medical documents, medicine records and reminders to get started.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: vScale(9),
        paddingHorizontal: scale(16),
    },
    titleText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(19),
        color: '#111',
        textAlign: 'center',
        lineHeight: vScale(26),
    },
    descriptionText: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(15),
        color: '#888',
        textAlign: 'center',
        lineHeight: vScale(20),
    },
})

export default Description