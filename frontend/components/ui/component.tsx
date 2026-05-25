import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';

// ─── BackButton ───────────────────────────────────────────────────────────────

export const BackButton: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={onPress ?? (() => router.back())}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            <Ionicons name="chevron-back" size={scale(20)} color="#EEF6A2" />
        </TouchableOpacity>
    );
};

// ─── ScreenHeader ─────────────────────────────────────────────────────────────

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    showBack?: boolean;
    right?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    subtitle,
    icon,
    showBack = false,
    right,
}) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            {showBack && <BackButton />}
            <View>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
            </View>
        </View>
        {right ?? (icon ? (
            <View style={styles.headerIconBadge}>
                <Ionicons name={icon} size={scale(20)} color="#EEF6A2" />
            </View>
        ) : null)}
    </View>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => (
    <View style={styles.emptyContainer}>
        <Ionicons name={icon} size={scale(44)} color="rgba(238, 246, 162, 0.2)" />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // BackButton
    backButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(10),
        backgroundColor: '#1E3A33',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.1)',
    },

    // ScreenHeader
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vScale(20),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    headerTitle: {
        fontSize: scale(26),
        fontWeight: '700',
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: scale(13),
        color: 'rgba(238,246,162,0.4)',
        fontFamily: 'Aeonik-Medium',
        marginTop: vScale(2),
    },
    headerIconBadge: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(12),
        backgroundColor: '#1E3A33',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.1)',
    },

    // EmptyState
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: vScale(10),
        paddingHorizontal: scale(32),
        paddingBottom: vScale(60),
    },
    emptyTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        marginTop: vScale(4),
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: scale(13),
        color: 'rgba(238,246,162,0.4)',
        fontFamily: 'Aeonik-Medium',
        textAlign: 'center',
        lineHeight: scale(20),
    },
});