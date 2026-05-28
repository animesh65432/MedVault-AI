import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../theme'

const HIPAANote: React.FC = () => (
    <View style={styles.container}>
        <View style={styles.orb} />
        <Text style={styles.text}>HIPAA COMPLIANT · ENCRYPTED</Text>
        <View style={styles.orb} />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    orb: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: Colors.hipaaOrb,
    },
    text: {
        fontSize: 8,
        color: Colors.hipaa,
        letterSpacing: 1.8,
        fontWeight: '500',
    },
})

export default HIPAANote