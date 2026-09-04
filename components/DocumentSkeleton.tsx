import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, View } from "react-native"

const FieldBlock: React.FC<{
    opacity: Animated.Value
    labelWidth: string
    valueWidth: string
    valueHeight?: number
}> = ({ opacity, labelWidth, valueWidth, valueHeight }) => {
    return (
        <View style={styles.fieldBlock}>
            <Animated.View
                style={[
                    styles.line,
                    styles.labelLine,
                    { width: labelWidth as any, opacity },
                ]}
            />
            <Animated.View
                style={[
                    styles.line,
                    styles.valueLine,
                    {
                        width: valueWidth as any,
                        height: valueHeight ?? vScale(16),
                        opacity,
                    },
                ]}
            />
        </View>
    )
}

const CardBlock: React.FC<{ opacity: Animated.Value }> = ({ opacity }) => {
    return (
        <View style={styles.card}>
            <Animated.View
                style={[styles.line, styles.cardTitleLine, { opacity }]}
            />
            <FieldBlock opacity={opacity} labelWidth="30%" valueWidth="55%" />
            <FieldBlock opacity={opacity} labelWidth="35%" valueWidth="45%" />
        </View>
    )
}

const DocumentSkeleton: React.FC = () => {
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
        <View style={styles.container}>
            {/* Navbar placeholder — mirrors Navbar's title + back/delete icons */}
            <View style={styles.navbar}>
                <Animated.View
                    style={[styles.line, styles.navbarIcon, { opacity }]}
                />
                <Animated.View
                    style={[styles.line, styles.navbarTitle, { opacity }]}
                />
                <Animated.View
                    style={[styles.line, styles.navbarIcon, { opacity }]}
                />
            </View>

            {/* Content — mirrors the ScrollView content area */}
            <View style={styles.content}>
                {/* Title field, like onChangeTitle input at top of each doc type */}
                <Animated.View
                    style={[styles.line, styles.titleLine, { opacity }]}
                />

                {/* A couple of top-level field rows (date, doctor, clinic etc.) */}
                <FieldBlock opacity={opacity} labelWidth="25%" valueWidth="60%" />
                <FieldBlock opacity={opacity} labelWidth="25%" valueWidth="40%" />
                <FieldBlock opacity={opacity} labelWidth="20%" valueWidth="70%" />

                {/* Tag chips row */}
                <View style={styles.tagsRow}>
                    <Animated.View
                        style={[styles.tagChip, { opacity }]}
                    />
                    <Animated.View
                        style={[styles.tagChip, styles.tagChipWide, { opacity }]}
                    />
                    <Animated.View
                        style={[styles.tagChip, { opacity }]}
                    />
                </View>

                {/* Cards, like medicine/test/billing item rows */}
                <CardBlock opacity={opacity} />
                <CardBlock opacity={opacity} />

                {/* Notes block */}
                <Animated.View
                    style={[styles.line, styles.sectionLabel, { opacity }]}
                />
                <Animated.View
                    style={[styles.line, styles.noteLine, { opacity }]}
                />
                <Animated.View
                    style={[styles.line, styles.noteLineShort, { opacity }]}
                />
            </View>

            {/* Bottom bar placeholder — mirrors Below (view original / edit) */}
            <View style={styles.bottomBar}>
                <Animated.View
                    style={[styles.line, styles.bottomButton, { opacity }]}
                />
                <Animated.View
                    style={[styles.line, styles.bottomButton, { opacity }]}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: vScale(40),
        paddingHorizontal: scale(16),
    },

    /* ---------------- Navbar ---------------- */

    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(16),
        paddingTop: vScale(14),
        paddingBottom: vScale(14),
    },

    navbarIcon: {
        width: scale(24),
        height: scale(24),
        borderRadius: scale(12),
    },

    navbarTitle: {
        width: "40%",
        height: vScale(16),
    },

    /* ---------------- Content ---------------- */

    content: {
        paddingHorizontal: scale(16),
        paddingTop: vScale(8),
        gap: vScale(14),
    },

    titleLine: {
        width: "70%",
        height: vScale(20),
        marginBottom: vScale(4),
    },

    fieldBlock: {
        gap: vScale(6),
    },

    labelLine: {
        height: vScale(10),
        backgroundColor: "#E4EDEA",
    },

    valueLine: {
        height: vScale(16),
    },

    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(8),
        marginTop: vScale(4),
    },

    tagChip: {
        width: scale(60),
        height: vScale(26),
        borderRadius: scale(13),
        backgroundColor: "#EEF3F1",
    },

    tagChipWide: {
        width: scale(90),
    },
    card: {
        backgroundColor: "#FAFAF8",
        borderRadius: scale(14),
        padding: scale(12),
        gap: vScale(10),
    },

    cardTitleLine: {
        width: "45%",
        height: vScale(14),
    },

    /* ---------------- Notes ---------------- */

    sectionLabel: {
        width: "30%",
        height: vScale(12),
        marginTop: vScale(4),
        backgroundColor: "#E4EDEA",
    },

    noteLine: {
        width: "95%",
        height: vScale(14),
    },

    noteLineShort: {
        width: "60%",
        height: vScale(14),
    },

    /* ---------------- Shared line style ---------------- */

    line: {
        borderRadius: scale(4),
        backgroundColor: "#EEF3F1",
    },

    /* ---------------- Bottom bar ---------------- */

    bottomBar: {
        flexDirection: "row",
        gap: scale(10),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(14),
        borderTopWidth: 1,
        borderTopColor: "#EEF3F1",
    },

    bottomButton: {
        flex: 1,
        height: vScale(46),
        borderRadius: scale(14),
    },
})

export default DocumentSkeleton