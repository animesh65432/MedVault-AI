import { useState, useRef, useEffect } from 'react'
import { Animated } from 'react-native'
import { Timing } from '@/components/DocumentScaning/theme'

export const useCycleText = (messages: string[]) => {
    const [index, setIndex] = useState(0)
    const opacity = useRef(new Animated.Value(1)).current
    const translateY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 320, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 5, duration: 320, useNativeDriver: true }),
            ]).start(() => {
                setIndex(i => (i + 1) % messages.length)
                translateY.setValue(5)
                Animated.parallel([
                    Animated.timing(opacity, { toValue: 1, duration: 320, useNativeDriver: true }),
                    Animated.timing(translateY, { toValue: 0, duration: 320, useNativeDriver: true }),
                ]).start()
            })
        }, Timing.statusInterval)

        return () => clearInterval(interval)
    }, [])

    return { text: messages[index], opacity, translateY }
}