import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { vScale } from '@/utils/vScale'
import ScanLine from '../Scanline'
import CornerBrackets from '../Cornerbrackets'
import PulseRings from '../Pulserings'

const CARD_WIDTH = vScale(260)
const CARD_HEIGHT = vScale(320)

type Props = {
    fileUri: string
    fileName: string
}

const DocumentCard: React.FC<Props> = ({ fileUri, fileName }) => (
    <View style={styles.wrapper}>
        {/* Animated rings sit behind the card */}
        <PulseRings />

        {/* Corner brackets sit outside the card */}
        <CornerBrackets />

        {/* The actual document preview */}
        <View style={styles.card}>
            <Image
                source={{ uri: fileUri }}
                style={styles.image}
                resizeMode="contain"
                alt={fileName}
            />

            {/* Subtle dark overlay so scan line is visible on light docs */}
            <View style={styles.overlay} pointerEvents="none" />

            {/* Scan line clips inside card via overflow:hidden */}
            <ScanLine cardHeight={CARD_HEIGHT} />
        </View>
    </View>
)

const styles = StyleSheet.create({
    wrapper: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.15)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.12)',
    },
})

export { CARD_HEIGHT, CARD_WIDTH }
export default DocumentCard