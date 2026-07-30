import { scale } from "@/utils/scale"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { Pressable, StyleSheet } from "react-native"

interface FABProps {
    onPress: () => void
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
    return (
        <Pressable style={styles.fab} onPress={onPress} hitSlop={10}>
            <Ionicons name="add" size={scale(26)} color="#FFFFFF" />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: scale(20),
        bottom: scale(140),
        width: scale(52),
        height: scale(52),
        borderRadius: scale(26),
        backgroundColor: "#1F3A2E",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
})

export default FAB