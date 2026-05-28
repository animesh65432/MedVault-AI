import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { Colors, Timing } from '../theme'

type RingConfig = {
    width: number
    height: number
    borderColor: string
    delay: number
    scaleTo: number
}

const RINGS: RingConfig[] = [
    { width: 272, height: 336, borderColor: Colors.ringOuter, delay: Timing.pulseDelay, scaleTo: 1.06 },
    { width: 248, height: 312, borderColor: Colors.ringInner, delay: 0, scaleTo: 1.05 },
]

type SingleRingProps = RingConfig

const SingleRing: React.FC<SingleRingProps> = ({
    width, height, borderColor, delay, scaleTo,
}) => {
    const scale = useRef(new Animated.Value(1)).current
    const opacity = useRef(new Animated.Value(0.3)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(scale, { toValue: scaleTo, duration: Timing.pulseDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.05, duration: Timing.pulseDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(scale, { toValue: 1, duration: Timing.pulseDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.3, duration: Timing.pulseDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                ]),
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [])

    return (
        <Animated.View
            style={[
                styles.ring,
                { width, height, borderColor, opacity, transform: [{ scale }] },
            ]}
        />
    )
}

const PulseRings: React.FC = () => (
    <View style={styles.container} pointerEvents="none">
        {RINGS.map((ring, i) => <SingleRing key={i} {...ring} />)}
    </View>
)

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        borderRadius: 22,
        borderWidth: 1,
    },
})

export default PulseRings