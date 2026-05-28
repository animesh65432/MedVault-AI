import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { Colors, Timing } from '../theme'

type Props = {
    cardHeight: number
}

const ScanLine: React.FC<Props> = ({ cardHeight }) => {
    const position = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(position, {
                toValue: 1,
                duration: Timing.scanDuration,
                easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
                useNativeDriver: true,
            })
        )
        loop.start()
        return () => loop.stop()
    }, [])

    const translateY = position.interpolate({
        inputRange: [0, 1],
        outputRange: [-2, cardHeight + 2],
    })

    const opacity = position.interpolate({
        inputRange: [0, 0.04, 0.93, 1],
        outputRange: [0, 1, 1, 0],
    })

    return (
        <Animated.View
            style={[styles.line, { opacity, transform: [{ translateY }] }]}
        />
    )
}

const styles = StyleSheet.create({
    line: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: Colors.lime,
        shadowColor: Colors.lime,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.85,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 10,
    },
})

export default ScanLine