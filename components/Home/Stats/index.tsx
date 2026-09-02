import AnimatedCounter from "@/components/AnimatedCounter"
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
                <View style={styles.IconContainer}>
                    <Fontisto
                        name="file-1"
                        size={scale(24)}
                        color="#23423B"
                    />
                </View>
                <AnimatedCounter
                    targetValue={documentsCount}
                />
                <Text style={styles.label}>Documents</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
                style={styles.statBox}
                onPress={() => router.push("/Medicines")}
            >
                <View style={styles.IconContainer}>
                    <FontAwesome5
                        name="pills"
                        size={scale(24)}
                        color="#23423B"
                    />
                </View>
                <AnimatedCounter
                    targetValue={medicinesCount}
                />
                <Text style={styles.label}>Medicines</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
                style={styles.statBox}
                onPress={() => router.push("/(tabs)/Alerts")}
            >
                <View style={styles.IconContainer}>
                    <Entypo
                        name="bell"
                        size={scale(24)}
                        color="#23423B"
                    />
                </View>
                <AnimatedCounter
                    targetValue={remindersCount}
                />
                <Text style={styles.label}>Alerts</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#23423B",
        borderRadius: scale(16),
        paddingVertical: vScale(16),
        paddingHorizontal: scale(12),
    },
    statBox: {
        flex: 1,
        alignItems: "center",
        gap: vScale(4),
    },
    divider: {
        width: 1,
        height: vScale(56),
        backgroundColor: "#E0E0DC",
    },
    count: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "white",
    },
    label: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(12),
        color: "white",
        textAlign: "center",
    },
    IconContainer: {
        backgroundColor: "#EEF6A2",
        padding: scale(10),
        borderRadius: scale(10)
    }
})

export default Stats