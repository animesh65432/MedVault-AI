import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from "react-native";

const DocumentSkeleton: React.FC = () => {
    const pulse = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [pulse]);

    return (
        <View style={styles.container}>
            <View style={styles.navRow}>
                <Animated.View style={[styles.block, styles.navBack, { opacity: pulse }]} />
                <Animated.View style={[styles.block, styles.navDelete, { opacity: pulse }]} />
            </View>

            <Animated.View style={[styles.block, styles.titleLine, { opacity: pulse }]} />
            <Animated.View style={[styles.block, styles.subtitleLine, { opacity: pulse }]} />

            <View style={styles.pillRow}>
                <Animated.View style={[styles.block, styles.pill, { opacity: pulse }]} />
                <Animated.View style={[styles.block, styles.pill, { opacity: pulse }]} />
                <Animated.View style={[styles.block, styles.pillSmall, { opacity: pulse }]} />
            </View>

            <View style={styles.section}>
                <Animated.View style={[styles.block, styles.sectionLabel, { opacity: pulse }]} />
                <Animated.View style={[styles.block, styles.card, { opacity: pulse }]} />
                <Animated.View style={[styles.block, styles.card, { opacity: pulse }]} />
            </View>

            <View style={styles.section}>
                <Animated.View style={[styles.block, styles.sectionLabel, { opacity: pulse }]} />
                <Animated.View style={[styles.block, styles.cardTall, { opacity: pulse }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF8',
        paddingHorizontal: scale(16),
        paddingTop: vScale(40),
        gap: scale(10),
    },
    block: {
        backgroundColor: '#E5F0EB',
        borderRadius: scale(8),
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(10),
    },
    navBack: {
        width: scale(80),
        height: vScale(34),
        borderRadius: scale(8),
    },
    navDelete: {
        width: scale(34),
        height: vScale(34),
        borderRadius: scale(8),
    },
    titleLine: {
        width: '70%',
        height: scale(18),
        borderRadius: scale(6),
        marginTop: scale(6),
    },
    subtitleLine: {
        width: '45%',
        height: scale(12),
        borderRadius: scale(6),
    },
    pillRow: {
        flexDirection: 'row',
        gap: scale(6),
        marginTop: scale(8),
    },
    pill: {
        width: scale(70),
        height: scale(22),
        borderRadius: scale(20),
    },
    pillSmall: {
        width: scale(50),
        height: scale(22),
        borderRadius: scale(20),
    },
    section: {
        gap: scale(8),
        marginTop: scale(14),
    },
    sectionLabel: {
        width: scale(90),
        height: scale(10),
        borderRadius: scale(4),
    },
    card: {
        width: '100%',
        height: vScale(56),
        borderRadius: scale(12),
    },
    cardTall: {
        width: '100%',
        height: vScale(110),
        borderRadius: scale(12),
    },
});

export default DocumentSkeleton;