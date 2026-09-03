import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    currentDocument: "false" | "true"
    documentId?: Number
}

const ChatBotAI: React.FC<Props> = ({ currentDocument, documentId }) => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const redirect_to_chat = () => {
        router.push({
            pathname: "/Chat",
            params: {
                currentDocument,
                documentId: documentId?.toString() || undefined
            }
        })
    }

    return (
        <TouchableOpacity
            onPress={redirect_to_chat}
            activeOpacity={0.85}
            style={[
                styles.Container,
                currentDocument === "true"
                    ? { bottom: vScale(70) + insets.bottom + vScale(60) }
                    : { bottom: vScale(70) + insets.bottom }
            ]}
        >
            <LottieView
                source={require("../assets/animations/animation.json")}
                autoPlay
                loop
                style={styles.animation}
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
        borderRadius: scale(35),
    },
    animation: {
        width: scale(110),
        height: vScale(110),
        marginLeft: scale(-35)
    },
})

export default ChatBotAI