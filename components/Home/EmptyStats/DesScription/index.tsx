import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { View, StyleSheet, Text } from "react-native"

const Description = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.descriptionText}>
                Start by uploading your first medical document .
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: vScale(12),
        paddingHorizontal: scale(16),
    },
    descriptionText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#888',
        textAlign: 'center',
        lineHeight: vScale(20),
    },
})

export default Description