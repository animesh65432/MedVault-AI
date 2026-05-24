import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface TopLoadingBarProps {
    isLoading: boolean;
}

const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ isLoading }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoading) {
            // Reset
            progressAnim.setValue(0);
            opacityAnim.setValue(1);

            // Glow pulse loop while loading
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 900,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 900,
                        useNativeDriver: false,
                    }),
                ])
            ).start();

            // Phase 1: jump to 10% instantly
            Animated.timing(progressAnim, {
                toValue: 10,
                duration: 80,
                useNativeDriver: false,
            }).start(() => {
                // Phase 2: ease to 70% while fetching
                Animated.timing(progressAnim, {
                    toValue: 70,
                    duration: 1800,
                    useNativeDriver: false,
                }).start();
            });

        } else {
            // Phase 3: jump to 100%
            glowAnim.stopAnimation();
            Animated.timing(progressAnim, {
                toValue: 100,
                duration: 220,
                useNativeDriver: false,
            }).start(() => {
                // Phase 4: fade out
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 320,
                    delay: 120,
                    useNativeDriver: false,
                }).start(() => {
                    progressAnim.setValue(0);
                });
            });
        }
    }, [isLoading]);

    const widthInterpolated = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
    });

    return (
        <Animated.View style={[styles.track, { opacity: opacityAnim }]}>
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: widthInterpolated,
                        opacity: glowOpacity,
                    },
                ]}
            >
                <View style={styles.leadingGlow} />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    track: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2.5,
        backgroundColor: 'rgba(238, 246, 162, 0.08)',
        zIndex: 9999,
    },
    bar: {
        height: '100%',
        backgroundColor: '#23423B',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    leadingGlow: {
        width: 48,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#23423B',
        shadowColor: '#EEF6A2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.95,
        shadowRadius: 8,
        elevation: 6,
        marginTop: -1.5,
    },
});

export default TopLoadingBar;