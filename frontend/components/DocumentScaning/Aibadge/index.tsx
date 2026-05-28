import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { Colors, Timing } from '../theme'

type BlinkDotProps = {
    delay?: number
}

const BlinkDot: React.FC<BlinkDotProps> = ({ delay = 0 }) => {
    const opacity = useRef(new Animated.Value(0.2)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(opacity, { toValue: 1, duration: Timing.blinkDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.2, duration: Timing.blinkDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [])

    return <Animated.View style={[styles.dot, { opacity }]} />
}

const AIBadge: React.FC = () => (
    <View style={styles.container}>
        <BlinkDot delay={0} />
        <BlinkDot delay={200} />
        <BlinkDot delay={400} />
        <Text style={styles.label}>AI ANALYZING</Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.limeFaint,
        borderWidth: 1,
        borderColor: Colors.limeBorder,
        borderRadius: 40,
        paddingVertical: 5,
        paddingHorizontal: 13,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.lime,
        marginRight: 1,
    },
    label: {
        fontSize: 9,
        color: Colors.limeDim,
        letterSpacing: 1.2,
        fontWeight: '600',
    },
})

export default AIBadge