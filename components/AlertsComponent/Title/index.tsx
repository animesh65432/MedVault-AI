import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    Count: number
}

const Title: React.FC<Props> = ({ Count }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.eyebrow}>Today's</Text>
                <Text style={styles.title}>Reminders</Text>
            </View>

            <View style={styles.details}>
                <View style={styles.countPill}>
                    <View style={styles.countDot} />
                    <Text style={styles.countNumber}>{Count}</Text>
                    <Text style={styles.countLabel}>
                        {Count === 1 ? "Reminder" : "Reminders"}
                    </Text>
                    <MaterialCommunityIcons
                        name="bell-ring"
                        size={scale(16)}
                        color="#4D661C"
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(20),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    titleContainer: {
        flexDirection: "column",
        gap: vScale(2)
    },
    eyebrow: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#234338",
        opacity: 0.6,
        letterSpacing: 0.2
    },
    title: {
        fontSize: fs(22),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C"
    },
    details: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10)
    },
    countPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(5),
        backgroundColor: "#EEF6A2",
        paddingHorizontal: scale(12),
        paddingVertical: vScale(7),
        borderRadius: scale(20)
    },
    countDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: "#4D661C"
    },
    countNumber: {
        color: "#0D1F1C",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14)
    },
    countLabel: {
        color: "#4D661C",
        fontFamily: "Aeonik-Regular",
        fontSize: fs(13)
    }
})

export default Title