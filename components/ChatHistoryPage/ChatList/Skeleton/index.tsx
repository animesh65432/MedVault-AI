import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, View } from "react-native"

const SkeletonRow: React.FC<{ opacity: Animated.Value }> = ({ opacity }) => (
    <View style={styles.chatContainer}>
        <View style={styles.firstRowCol}>
            <Animated.View style={[styles.icon, { opacity }]} />
            <View style={styles.col}>
                <Animated.View style={[styles.titleLine, { opacity }]} />
                <Animated.View style={[styles.dateLine, { opacity }]} />
            </View>
        </View>
        <Animated.View style={[styles.arrow, { opacity }]} />
    </View>
)

type Props = {
    count?: number
}

const ChatSkeleton: React.FC<Props> = ({ count = 6 }) => {
    const opacity = useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [opacity])

    return (
        <View>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonRow key={i} opacity={opacity} />
            ))}
        </View>
    )
}

const BONE = "#e3e3e3"

const styles = StyleSheet.create({
    chatContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomColor: "#ece4e4",
        borderBottomWidth: 1,
        paddingVertical: vScale(5),
        paddingBottom: vScale(10),
    },
    firstRowCol: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
    },
    col: {
        gap: vScale(6),
        width: "60%",
    },
    icon: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: BONE,
    },
    titleLine: {
        height: scale(18),
        width: "90%",
        borderRadius: scale(4),
        backgroundColor: BONE,
    },
    dateLine: {
        height: scale(12),
        width: "50%",
        borderRadius: scale(4),
        backgroundColor: BONE,
    },
    arrow: {
        width: scale(10),
        height: scale(18),
        borderRadius: scale(3),
        backgroundColor: BONE,
    },
})

export default ChatSkeleton