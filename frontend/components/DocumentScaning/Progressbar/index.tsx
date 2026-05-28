import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { Colors, Timing } from '../theme'

const ProgressBar: React.FC = () => {
    const progress = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 0.94,
            duration: Timing.progressDuration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: false,
        }).start()
    }, [])

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    })

    return (
        <View style={styles.track}>
            <Animated.View style={[styles.fill, { width }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    track: {
        width: 210,
        height: 2,
        backgroundColor: Colors.progressBg,
        borderRadius: 2,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: Colors.lime,
        borderRadius: 2,
    },
})

export default ProgressBar