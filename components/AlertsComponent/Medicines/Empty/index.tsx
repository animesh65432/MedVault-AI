import { scale } from "@/utils/scale"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.content}>

                <Ionicons
                    name="medkit"
                    size={44}
                    color="#0D483F"
                />
                <Text style={styles.title}>No Medicines Yet</Text>
                <Text style={styles.description}>
                    Add your medications to set custom intake reminders and track your daily doses seamlessly.
                </Text>

                <Animated.View style={[{ transform: [{ scale: scaleValue }] }, styles.buttonWrapper]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => router.push("/(tabs)/Medicines")}
                    >
                        <Ionicons name="add-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Create Medicine</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#0D483F",
    },
    backText: {
        fontSize: 15,
        fontWeight: "600",
        color: "white",
        marginLeft: 2,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        marginTop: -30,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#065F46",
        letterSpacing: -0.5,
        textAlign: "center",
        marginTop: scale(20),
    },
    description: {
        fontSize: 15,
        fontWeight: "400",
        color: "#0D483F",
        opacity: 0.75,
        textAlign: "center",
        lineHeight: 22,
        marginTop: 10,
        marginBottom: 36,
        maxWidth: 280,
    },
    buttonWrapper: {
        width: "100%",
        maxWidth: 260,
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#0D483F",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonPressed: {
        backgroundColor: "#059669",
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: -0.2,
    },
})