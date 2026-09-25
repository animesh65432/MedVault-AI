import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

const Skeleton: React.FC = () => {
    const opacity = useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        )
        pulse.start()
        return () => pulse.stop()
    }, [opacity])

    return (
        <View style={styles.wrap}>
            <Animated.View style={[styles.tile, { opacity }]}>
                <View style={styles.doc_type_container} />
                <View style={styles.fallbackBody}>
                    <View style={styles.icon} />
                    <View style={styles.fallbackTextWrap}>
                        <View style={styles.titleLine} />
                        <View style={styles.dateLine} />
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        aspectRatio: 1,
    },
    tile: {
        width: "100%",
        height: vScale(240),
        borderRadius: scale(15),
        overflow: 'hidden',
        backgroundColor: '#d8d6d6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    doc_type_container: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: scale(40),
        height: vScale(18),
        borderRadius: 6,
        backgroundColor: '#bdbdbd',
        zIndex: 1,
    },
    fallbackBody: {
        alignItems: 'center',
        gap: vScale(12),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "70%",
        width: "100%",
        marginTop: "auto"
    },
    icon: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(6),
        backgroundColor: '#bdbdbd',
        marginTop: vScale(12),
    },
    fallbackTextWrap: {
        alignItems: 'center',
        gap: vScale(6),
        backgroundColor: "white",
        padding: scale(8),
        width: "100%",
    },
    titleLine: {
        width: '70%',
        height: vScale(12),
        borderRadius: 4,
        backgroundColor: '#e2e2e2',
    },
    dateLine: {
        width: '40%',
        height: vScale(10),
        borderRadius: 4,
        backgroundColor: '#e2e2e2',
    },
})

export default Skeleton