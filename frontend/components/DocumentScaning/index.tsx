import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StatusBar, StyleSheet, View } from 'react-native'
import AIBadge from './Aibadge'
import DocumentCard from './Documentcard'
import HIPAANote from './Hipaanote'
import ProgressBar from './Progressbar'
import StatusText from './Statustext'
import { Colors, Timing } from './theme'

type Props = {
    fileUri: string
    fileName: string
    fileType: string
}

const DocumentScanning: React.FC<Props> = ({ fileUri, fileName, fileType }) => {
    const masterOpacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(masterOpacity, {
            toValue: 1,
            duration: Timing.masterFadeIn,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start()
    }, [])

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

            {/* Background radial glow */}
            <View style={styles.bgGlow} pointerEvents="none" />

            <Animated.View style={[styles.content, { opacity: masterOpacity }]}>
                <DocumentCard fileUri={fileUri} fileName={fileName} />

                {/* Gap */}
                <View style={styles.gap} />

                {/* AI badge */}
                <AIBadge />

                <View style={styles.gapSm} />

                {/* Cycling status text */}
                <StatusText />

                <View style={styles.gapSm} />

                {/* Progress bar */}
                <ProgressBar />

                <View style={styles.gapSm} />

                {/* HIPAA note */}
                <HIPAANote />

            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    bgGlow: {
        position: 'absolute',
        width: '140%',
        aspectRatio: 1,
        borderRadius: 9999,
        backgroundColor: Colors.bgGlow,
        top: '15%',
        alignSelf: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    gap: { height: 24 },
    gapSm: { height: 14 },
})

export default DocumentScanning