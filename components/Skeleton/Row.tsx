import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, View } from "react-native"

type Props = {
    count?: number
    IsHome?: boolean
}

const SkeletonCard: React.FC<{ opacity: Animated.Value }> = ({ opacity }) => {
    return (
        <Animated.View style={[styles.card, { opacity }]}>
            <View style={styles.iconWrapper} />
            <View style={styles.textWrapper}>
                <View style={[styles.line, styles.typeLine]} />
                <View style={[styles.line, styles.dateLine]} />
                <View style={[styles.line, styles.subtitleLine]} />
            </View>
        </Animated.View>
    )
}

const Row: React.FC<Props> = ({ count = 3, IsHome = false }) => {
    const opacity = useRef(new Animated.Value(0.5)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.5,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        )
        pulse.start()
        return () => pulse.stop()
    }, [opacity])

    return (
        <View style={[styles.container, { marginBottom: IsHome ? vScale(20) : vScale(20) }]}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} opacity={opacity} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: vScale(12),
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: scale(14),
        padding: scale(14),
        gap: scale(12),
    },
    iconWrapper: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(10),
        backgroundColor: "#23423B",
    },
    textWrapper: {
        flex: 1,
        gap: vScale(6),
    },
    line: {
        borderRadius: scale(4),
        backgroundColor: "#23423B",
    },
    typeLine: {
        width: "40%",
        height: vScale(12),
    },
    dateLine: {
        width: "25%",
        height: vScale(10),
    },
    subtitleLine: {
        width: "65%",
        height: vScale(10),
    },
})

export default Row