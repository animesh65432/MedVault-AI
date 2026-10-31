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
                <Feather
                    name="package"
                    size={scale(36)}
                    color="#9BAFA6"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>No medicines yet</Text>
                <Text style={styles.subtitle}>
                    Medicines you add will show up here, organized by date.
                </Text>
            </View>
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
        gap: vScale(20),
    },
    iconCircle: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: "#EDF2F1",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: fs(25),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
        textAlign: "center",
    },
    subtitle: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Regular",
        color: "#9BAFA6",
        textAlign: "center",
        lineHeight: fs(18),
        marginTop: vScale(2),
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: vScale(17),
    }
})

export default Empty