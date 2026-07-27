import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import Feather from "@expo/vector-icons/Feather"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

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
                { bottom: vScale(70) + insets.bottom }
            ]}
        >
            <LinearGradient
                colors={["#2E5748", "#0D1F1C"]}
                style={styles.Gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Feather name="message-circle" size={scale(28)} color="#EEF6A2" />
            </LinearGradient>
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: scale(8),
        elevation: 8, // Android shadow
    },
    Gradient: {
        width: "100%",
        height: "100%",
        borderRadius: scale(35),
        alignItems: "center",
        justifyContent: "center",
    },
})

export default ChatBotAI