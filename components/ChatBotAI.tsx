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
            : vScale(180) + insets.bottom;

    return <Pressable
        onPress={redirect_to_chat}
        accessibilityRole="button"
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
        elevation: 6,
        shadowColor: "#23423B",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    BelowNavbar: {
        position: "absolute",
        right: scale(20),
        height: vScale(52),
        paddingHorizontal: scale(8),
        backgroundColor: "#23423B",
        borderRadius: scale(26),
        flexDirection: "row",
        alignItems: "center",
        elevation: 8,
        paddingVertical: vScale(30),
        width: scale(130),
        display: "flex",
        justifyContent: "space-between",
    },
    action: {
        width: scale(48),
        height: scale(40),
        borderRadius: scale(20),
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        width: 1,
        borderColor: "rgba(143, 208, 21, 0.15)",
        borderWidth: 1,
        height: vScale(30),
    },
    pressed: {
        backgroundColor: "rgba(217, 249, 157, 0.15)",
        transform: [{ scale: 0.94 }],
    },
});

export default ChatBotAI;