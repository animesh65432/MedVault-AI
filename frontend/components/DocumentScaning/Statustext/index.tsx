import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useCycleText } from '@/hooks/Usecycletext'
import { Colors, STATUS_MESSAGES } from '../theme'

const StatusText: React.FC = () => {
    const { text, opacity, translateY } = useCycleText(STATUS_MESSAGES)

    return (
        <Animated.Text
            style={[
                styles.text,
                { opacity, transform: [{ translateY }] },
            ]}
        >
            {text}
        </Animated.Text>
    )
}

const styles = StyleSheet.create({
    text: {
        color: Colors.whiteStrong,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: -0.1,
        textAlign: 'center',
        minHeight: 20,
    },
})

export default StatusText