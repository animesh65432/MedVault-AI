import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { Colors } from '../theme'

type BracketPosition = {
    top?: number
    bottom?: number
    left?: number
    right?: number
}

type BracketBorders = {
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
}

type BracketConfig = {
    position: BracketPosition
    borders: BracketBorders
    delay: number
}

const BRACKETS: BracketConfig[] = [
    { position: { top: -8, left: -8 }, borders: { top: true, left: true }, delay: 0 },
    { position: { top: -8, right: -8 }, borders: { top: true, right: true }, delay: 500 },
    { position: { bottom: -8, left: -8 }, borders: { bottom: true, left: true }, delay: 1000 },
    { position: { bottom: -8, right: -8 }, borders: { bottom: true, right: true }, delay: 1500 },
]

type SingleBracketProps = BracketConfig

const SingleBracket: React.FC<SingleBracketProps> = ({ position, borders, delay }) => {
    const opacity = useRef(new Animated.Value(0.55)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(opacity, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.55, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [])

    const borderStyle: Record<string, number | string> = {}
    if (borders.top) { borderStyle.borderTopWidth = 2; borderStyle.borderTopColor = Colors.lime }
    if (borders.bottom) { borderStyle.borderBottomWidth = 2; borderStyle.borderBottomColor = Colors.lime }
    if (borders.left) { borderStyle.borderLeftWidth = 2; borderStyle.borderLeftColor = Colors.lime }
    if (borders.right) { borderStyle.borderRightWidth = 2; borderStyle.borderRightColor = Colors.lime }

    const radiusStyle: Record<string, number> = {}
    if (borders.top && borders.left) radiusStyle.borderTopLeftRadius = 5
    if (borders.top && borders.right) radiusStyle.borderTopRightRadius = 5
    if (borders.bottom && borders.left) radiusStyle.borderBottomLeftRadius = 5
    if (borders.bottom && borders.right) radiusStyle.borderBottomRightRadius = 5

    return (
        <Animated.View
            style={[styles.bracket, position, borderStyle, radiusStyle, { opacity }]}
        />
    )
}

const CornerBrackets: React.FC = () => (
    <>
        {BRACKETS.map((b, i) => <SingleBracket key={i} {...b} />)}
    </>
)

const styles = StyleSheet.create({
    bracket: {
        position: 'absolute',
        width: 22,
        height: 22,
    },
})

export default CornerBrackets