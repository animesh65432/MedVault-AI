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
            {/* Preview area — mirrors previewContainer in Document.tsx */}
            <View style={styles.previewContainer} />

            {/* Info area — mirrors info in Document.tsx */}
            <View style={styles.info}>
                <View style={[styles.line, styles.typeLine]} />
                <View style={[styles.line, styles.titleLine]} />
                <View style={[styles.line, styles.dateLine]} />
            </View>
        </Animated.View>
    )
}

const DocumentsSkeleton: React.FC<Props> = ({ count = 4, IsHome = false }) => {
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
        <View style={[styles.container, { marginBottom: IsHome ? vScale(20) : vScale(100) }]}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} opacity={opacity} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: scale(12),
        rowGap: vScale(14),
    },

    /* Matches Document.tsx `card` */
    card: {
        width: "48%",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(16),
        padding: scale(10),

        elevation: 1,
        shadowColor: "#23423B",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },

    /* Matches Document.tsx `previewContainer` */
    previewContainer: {
        width: "100%",
        height: vScale(145),
        borderRadius: scale(12),
        backgroundColor: "#EEF3F1",
    },

    /* Matches Document.tsx `info` */
    info: {
        paddingHorizontal: scale(3),
        paddingTop: vScale(10),
        gap: vScale(6),
    },

    line: {
        borderRadius: scale(4),
        backgroundColor: "#EEF3F1",
    },

    /* Roughly matches documentType text size */
    typeLine: {
        width: "50%",
        height: vScale(14),
    },

    /* Roughly matches title (2-line) text block */
    titleLine: {
        width: "85%",
        height: vScale(12),
    },

    /* Roughly matches date text size */
    dateLine: {
        width: "35%",
        height: vScale(11),
        marginTop: vScale(2),
    },
})

export default DocumentsSkeleton

