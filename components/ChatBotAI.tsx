import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
    currentDocument: "false" | "true";
    documentId?: number;
};

const SIZE = scale(56);

const ChatBotAI: React.FC<Props> = ({ currentDocument, documentId }) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const redirect_to_chat = () => {
        router.push({
            pathname: "/Chat",
            params: {
                currentDocument,
                documentId: documentId?.toString(),
            },
        });
    };

    const bottom =
        currentDocument === "true"
            ? vScale(70) + insets.bottom + vScale(60)
            : vScale(160) + insets.bottom;

    return (
        <Pressable
            onPress={redirect_to_chat}
            accessibilityRole="button"
            accessibilityLabel="Open AI chat assistant"
            style={({ pressed }) => [
                styles.container,
                { bottom },
                pressed && styles.pressed,
            ]}
        >
            <Ionicons
                name="chatbox"
                size={scale(24)}
                color="#D9F99D"
            />

        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: scale(20),
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: "#23423B",
        justifyContent: "center",
        alignItems: "center",

        // soft, tinted shadow
        elevation: 6,
        shadowColor: "#23423B",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    pressed: {
        transform: [{ scale: 0.94 }],
        opacity: 0.9,
    },
});

export default ChatBotAI;