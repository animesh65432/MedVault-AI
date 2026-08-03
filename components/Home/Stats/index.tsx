import { CountTypes } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'

const Stats: React.FC<CountTypes> = ({ documentsCount, medicinesCount, remindersCount }) => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.statBox}
                onPress={() => router.push("/Search")}
            >
                <Fontisto
                    name="file-1"
                    size={scale(24)}
                    color="#23423B"
                />
                <Text style={styles.count}>{documentsCount}</Text>
                <Text style={styles.label}>Documents</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
                style={styles.statBox}
                onPress={() => router.push("/Medicines")}
            >
                <FontAwesome5
                    name="pills"
                    size={scale(24)}
                    color="#23423B"
                />
                <Text style={styles.count}>{medicinesCount}</Text>
                <Text style={styles.label}>Medicines</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
                style={styles.statBox}
                onPress={() => router.push("/(tabs)/Alerts")}
            >
                <Entypo
                    name="bell"
                    size={scale(24)}
                    color="#23423B"
                />
                <Text style={styles.count}>{remindersCount}</Text>
                <Text style={styles.label}>Alerts</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(16),
        paddingVertical: vScale(16),
        paddingHorizontal: scale(12),
    },
    statBox: {
        flex: 1,
        alignItems: "center",
        gap: vScale(4)
    },
    divider: {
        width: 1,
        height: vScale(36),
        backgroundColor: "#E0E0DC",
    },
    count: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "#23423B",
    },
    label: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(12),
        color: "#5A7A74",
        textAlign: "center",
    },
})

export default Stats