import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function EmptyState() {
    const router = useRouter()
    const scaleValue = new Animated.Value(1)

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start()
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons
                        name="pill"
                        size={scale(40)}
                        color="#0D483F"
                    />
                </View>
                <Text style={styles.title}>No Medicines Yet</Text>
                <Text style={styles.description}>
                    Add your medications to set custom intake reminders and track your daily doses seamlessly.
                </Text>
                <Pressable
                    style={styles.button}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={() => router.replace("/Medicines")}
                >
                    <Ionicons name="add-circle" size={scale(24)} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Create Medicine</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: scale(16),
        paddingTop: scale(8),
        paddingBottom: scale(8),
    },
    content: {
        flex: 1,
        alignItems: "center",
        marginTop: vScale(130),
    },
    title: {
        fontSize: fs(26),
        letterSpacing: -0.5,
        textAlign: "center",
        marginTop: scale(20),
        fontFamily: "Aeonik-Medium",
    },
    description: {
        fontSize: fs(16),
        fontWeight: "400",
        color: "#9BAFA6",
        opacity: 0.75,
        textAlign: "center",
        lineHeight: vScale(22),
        marginTop: vScale(10),
        marginBottom: vScale(36),
        maxWidth: scale(300),
        fontFamily: "Aeonik-Medium",
    },
    buttonWrapper: {
        width: "100%",
        maxWidth: scale(260),
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#0D483F",
        paddingVertical: scale(10),
        paddingHorizontal: scale(24),
        borderRadius: scale(36),
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.3,
        shadowRadius: scale(12),
        elevation: 5,
    },
    buttonPressed: {
        backgroundColor: "#059669",
    },
    buttonIcon: {
        marginRight: scale(8),
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: fs(16),
        letterSpacing: -0.2,
        fontFamily: "Aeonik-Medium",
    },
    iconCircle: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: "#EDF2F1",
        alignItems: "center",
        justifyContent: "center",
    }
})