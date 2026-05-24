import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { vScale } from "@/utils/vScale"
import { StatsInformation } from '@/types'
import { scale } from '@/utils/scale';

interface StatsProps {
    statsInformation: StatsInformation;
}

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: number;
    label: string;
    delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, delay }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(vScale(16))).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 420,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                delay,
                damping: 18,
                stiffness: 140,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay,
                damping: 16,
                stiffness: 120,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim },
                    ],
                },
            ]}
        >
            {/* Top accent bar */}
            <View style={styles.accentBar} />

            {/* Icon badge */}
            <View style={styles.iconBadge}>
                <Ionicons name={icon} size={scale(18)} color="#23423B" />
            </View>

            {/* Value */}
            <Text style={styles.valueText}>{value}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Label */}
            <Text style={styles.labelText}>{label}</Text>
        </Animated.View>
    );
};

const Stats: React.FC<StatsProps> = ({ statsInformation }) => {
    return (
        <View style={styles.container}>
            <StatCard
                icon="document-text-outline"
                value={statsInformation.total_documents}
                label="Documents"
                delay={0}
            />
            <StatCard
                icon="medkit-outline"
                value={statsInformation.total_medicine_records}
                label="Medicines"
                delay={80}
            />
            <StatCard
                icon="alarm-outline"
                value={statsInformation.total_reminders}
                label="Reminders"
                delay={160}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: vScale(10),
    },
    card: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#1E3A33",
        borderRadius: vScale(14),
        paddingTop: vScale(14),
        paddingBottom: vScale(14),
        paddingHorizontal: scale(8),
        overflow: "hidden",
        // Subtle shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: vScale(4) },
        shadowOpacity: 0.18,
        shadowRadius: vScale(8),
        elevation: 4,
        borderWidth: 1,
        borderColor: "rgba(238, 246, 162, 0.08)",
    },
    accentBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: vScale(3),
        backgroundColor: "#EEF6A2",
        borderTopLeftRadius: vScale(14),
        borderTopRightRadius: vScale(14),
    },
    iconBadge: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(10),
        backgroundColor: "#EEF6A2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: vScale(10),
    },
    valueText: {
        fontSize: scale(22),
        fontWeight: "700",
        color: "#EEF6A2",
        fontFamily: "Aeonik-Medium",
        letterSpacing: -0.5,
        lineHeight: scale(26),
    },
    divider: {
        width: scale(24),
        height: 1,
        backgroundColor: "rgba(238, 246, 162, 0.2)",
        marginVertical: vScale(6),
    },
    labelText: {
        fontSize: scale(11),
        fontWeight: "500",
        color: "rgba(238, 246, 162, 0.6)",
        fontFamily: "Aeonik-Medium",
        textAlign: "center",
        letterSpacing: 0.3,
    },
});

export default Stats;