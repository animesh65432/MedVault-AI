import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const useShimmer = () => {
    const shimmerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: SCREEN_WIDTH,
                duration: 1400,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    return shimmerAnim;
};

const ShimmerOverlay: React.FC<{ shimmerAnim: Animated.Value }> = ({ shimmerAnim }) => (
    <Animated.View
        style={[
            styles.shimmer,
            { transform: [{ translateX: shimmerAnim }] },
        ]}
    />
);

// ─── Skeleton block ──────────────────────────────────────────────────────────

interface BlockProps {
    width?: number | string;
    height?: number;
    radius?: number;
    shimmerAnim: Animated.Value;
    style?: object;
}

const Block: React.FC<BlockProps> = ({
    width = '100%',
    height = vScale(12),
    radius = scale(6),
    shimmerAnim,
    style,
}) => (
    <View
        style={[
            styles.block,
            { width: width as any, height, borderRadius: radius },
            style,
        ]}
    >
        <ShimmerOverlay shimmerAnim={shimmerAnim} />
    </View>
);

// ─── Stats skeleton ──────────────────────────────────────────────────────────

export const StatsSkeleton: React.FC = () => {
    const shimmerAnim = useShimmer();

    return (
        <View style={styles.statsRow}>
            {[0, 1, 2].map((i) => (
                <View key={i} style={styles.statCard}>
                    {/* Icon badge */}
                    <Block
                        width={scale(36)}
                        height={scale(36)}
                        radius={scale(10)}
                        shimmerAnim={shimmerAnim}
                    />
                    {/* Number */}
                    <Block
                        width={scale(28)}
                        height={vScale(14)}
                        radius={scale(4)}
                        shimmerAnim={shimmerAnim}
                        style={{ marginTop: vScale(10) }}
                    />
                    {/* Divider */}
                    <Block
                        width={scale(24)}
                        height={1}
                        radius={1}
                        shimmerAnim={shimmerAnim}
                        style={{ marginTop: vScale(6) }}
                    />
                    {/* Label */}
                    <Block
                        width={scale(44)}
                        height={vScale(10)}
                        radius={scale(4)}
                        shimmerAnim={shimmerAnim}
                        style={{ marginTop: vScale(6) }}
                    />
                </View>
            ))}
        </View>
    );
};

// ─── Document card skeleton ──────────────────────────────────────────────────

const DocumentCardSkeleton: React.FC<{ shimmerAnim: Animated.Value }> = ({ shimmerAnim }) => (
    <View style={styles.docCard}>
        {/* Left stripe */}
        <View style={styles.docStripe} />

        {/* Icon badge */}
        <Block
            width={scale(42)}
            height={scale(42)}
            radius={scale(12)}
            shimmerAnim={shimmerAnim}
            style={{ marginRight: scale(12) }}
        />

        {/* Body */}
        <View style={styles.docBody}>
            {/* Top row: type badge + date */}
            <View style={styles.docTopRow}>
                <Block
                    width={scale(56)}
                    height={vScale(18)}
                    radius={scale(6)}
                    shimmerAnim={shimmerAnim}
                />
                <Block
                    width={scale(48)}
                    height={vScale(10)}
                    radius={scale(4)}
                    shimmerAnim={shimmerAnim}
                />
            </View>

            {/* Title */}
            <Block
                width="85%"
                height={vScale(13)}
                radius={scale(4)}
                shimmerAnim={shimmerAnim}
                style={{ marginTop: vScale(6) }}
            />

            {/* Subtitle */}
            <Block
                width="55%"
                height={vScale(11)}
                radius={scale(4)}
                shimmerAnim={shimmerAnim}
                style={{ marginTop: vScale(5) }}
            />

            {/* Pills */}
            <View style={styles.pillRow}>
                {[52, 68, 44].map((w, i) => (
                    <Block
                        key={i}
                        width={scale(w)}
                        height={vScale(20)}
                        radius={scale(6)}
                        shimmerAnim={shimmerAnim}
                    />
                ))}
            </View>
        </View>

        {/* Chevron */}
        <Block
            width={scale(14)}
            height={scale(14)}
            radius={scale(4)}
            shimmerAnim={shimmerAnim}
            style={{ marginLeft: scale(8) }}
        />
    </View>
);

export const DocumentListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
    const shimmerAnim = useShimmer();

    return (
        <View style={styles.docList}>
            {Array.from({ length: count }).map((_, i) => (
                <DocumentCardSkeleton key={i} shimmerAnim={shimmerAnim} />
            ))}
        </View>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // Shimmer
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(238, 246, 162, 0.07)',
        width: SCREEN_WIDTH * 0.5,
    },

    // Block
    block: {
        backgroundColor: '#243f38',
        overflow: 'hidden',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: vScale(10),
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#1E3A33',
        borderRadius: vScale(14),
        paddingTop: vScale(14),
        paddingBottom: vScale(14),
        paddingHorizontal: scale(8),
        borderWidth: 1,
        borderColor: 'rgba(238, 246, 162, 0.08)',
        overflow: 'hidden',
    },

    // Document card
    docCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3A33',
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: 'rgba(238, 246, 162, 0.08)',
        paddingVertical: vScale(14),
        paddingRight: scale(12),
        overflow: 'hidden',
    },
    docStripe: {
        width: scale(3),
        alignSelf: 'stretch',
        backgroundColor: '#243f38',
        borderTopRightRadius: scale(3),
        borderBottomRightRadius: scale(3),
        marginRight: scale(12),
    },
    docBody: {
        flex: 1,
        gap: vScale(2),
    },
    docTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pillRow: {
        flexDirection: 'row',
        gap: scale(6),
        marginTop: vScale(6),
    },
    docList: {
        gap: vScale(10),
    },
});