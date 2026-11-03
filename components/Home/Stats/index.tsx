import DocsIcon from "@/components/DocsIcon"
import { CountTypes } from "@/types"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { useRouter } from "expo-router"
import React from "react"
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import Animated, { SlideInLeft } from "react-native-reanimated"

const Stats: React.FC<CountTypes> = ({
    documentsCount,
    medicinesCount,
}) => {
    const router = useRouter()

    return (
        <Animated.View
            style={styles.container}
            entering={SlideInLeft.duration(400)}
        >
            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.statBox}
                onPress={() => router.push("/Documents")}
            >
                <View style={styles.topRow}>
                    {
                        documentsCount > 9 ?
                            <Text style={styles.CounterText}>
                                {documentsCount}
                            </Text> :
                            <Text style={styles.CounterText}>
                                0{documentsCount}
                            </Text>
                    }
                    <View style={styles.FirstIconContainer}>
                        <DocsIcon
                            width={scale(25)}
                            height={scale(25)}
                            color="#23423B"
                        />
                    </View>
                </View>


                <Text style={styles.label}>
                    Documents
                </Text>

                <Text style={styles.subLabel}>
                    Medical records
                </Text>
            </TouchableOpacity>


            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.statBox}
                onPress={() => router.push("/Medicines")}
            >
                <View style={styles.topRow}>
                    {
                        medicinesCount > 9 ?
                            <Text style={styles.CounterText}>
                                {medicinesCount}
                            </Text> :
                            <Text style={styles.CounterText}>
                                0{medicinesCount}
                            </Text>
                    }
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name="pill"
                            style={styles.medicineIcon}
                            color="#23423B"
                        />
                    </View>
                </View>

                <Text style={styles.label}>
                    Medicines
                </Text>

                <Text style={styles.subLabel}>
                    Active medicines
                </Text>
            </TouchableOpacity>

        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: scale(12),
    },

    statBox: {
        flex: 1,
        backgroundColor: "#0D483F",
        borderRadius: scale(16),
        paddingHorizontal: scale(10),
        paddingVertical: vScale(14),
        justifyContent: "space-between",
        overflow: "hidden",
        gap: vScale(4),
    },

    topRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    FirstIconContainer: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(12),
        backgroundColor: "#eef0db",
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(12),
        backgroundColor: "#EEF6A2",
        alignItems: "center",
        justifyContent: "center",
    },

    medicineIcon: {
        fontSize: scale(21),
    },

    label: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(17),
        color: "#FFFFFF",
        marginTop: vScale(4),
    },

    subLabel: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(14),
        color: "rgba(255,255,255,0.65)",
    },
    CounterText: {
        fontSize: fs(24),
        fontWeight: "bold",
        color: "white",
    },
})

export default Stats