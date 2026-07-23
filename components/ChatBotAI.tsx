import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from "expo-router"
import LottieView from "lottie-react-native"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ChatBotAI = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const redirect_to_chat = () => {
        router.push("/Chat")
    }

    return (
        <TouchableOpacity
            onPress={redirect_to_chat}
            style={[
                styles.Container,
                { bottom: vScale(70) + insets.bottom }
            ]}
        >
            <LottieView
                source={require("../assets/animations/AIChatBot/animations/main.json")}
                autoPlay
                loop={true}
                resizeMode="contain"
                style={styles.Lottie}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    Container: {
        position: "absolute",
        right: scale(20),
        width: scale(70),
        height: scale(70),
    },
    Lottie: {
        width: "100%",
        height: "100%"
    }
})

export default ChatBotAI