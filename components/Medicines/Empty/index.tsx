import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import Feather from '@expo/vector-icons/Feather'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Empty: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Feather name="package" size={scale(26)} color="#9BAFA6" />
            </View>

            <Text style={styles.title}>No medicines yet</Text>

            <Text style={styles.subtitle}>
                Medicines you add will show up here, organized by date.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: scale(32),
        paddingVertical: vScale(60),
        gap: vScale(6),
    },
    iconCircle: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: "#EDF2F1",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: vScale(14),
    },
    title: {
        fontSize: fs(15),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
        textAlign: "center",
    },
    subtitle: {
        fontSize: fs(12.5),
        fontFamily: "Aeonik-Regular",
        color: "#9BAFA6",
        textAlign: "center",
        lineHeight: fs(18),
        marginTop: vScale(2),
    },
})

export default Empty