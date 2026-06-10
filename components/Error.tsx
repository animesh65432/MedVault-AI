import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Error: React.FC<{ fetchData: () => void }> = ({ fetchData }) => {
    return (
        <View style={styles.centerState}>
            <Ionicons
                name="cloud-offline-outline"
                size={scale(40)}
                color="rgba(238, 246, 162, 0.3)"
            />
            <Text style={styles.errorTitle}>Couldn't load your data</Text>
            <Text style={styles.errorSubtitle}>Check your connection and try again</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
                <Ionicons name="refresh-outline" size={scale(15)} color="#23423B" />
                <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    centerState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: vScale(10),
        paddingHorizontal: scale(32),
    },
    errorTitle: {
        fontSize: scale(16),
        fontWeight: "600",
        color: "#23423B",
        fontFamily: "Aeonik-Medium",
        marginTop: vScale(4),
    },
    errorSubtitle: {
        fontSize: scale(13),
        color: "#23423B",
        fontFamily: "Aeonik-Medium",
        textAlign: "center",
    },
    retryButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6),
        backgroundColor: "#EEF6A2",
        paddingVertical: vScale(10),
        paddingHorizontal: scale(20),
        borderRadius: scale(10),
        marginTop: vScale(8),
    },
    retryText: {
        fontSize: scale(14),
        fontWeight: "600",
        color: "#23423B",
        fontFamily: "Aeonik-Medium",
    },
})

export default Error