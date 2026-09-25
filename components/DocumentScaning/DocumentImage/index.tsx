import { usePdfThumbnail } from '@/hooks/usePdfThumbnail';
import { vScale } from '@/utils/vScale';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

type ScanFrameImageProps = {
    fileUri: string;
    IsPdf: boolean;
    frameWidthRatio?: number;
    frameHeightRatio?: number;
};

const SCAN_DURATION_MS = 2000;
const CORNER_SIZE = vScale(28);
const CORNER_THICKNESS = 3;
const CORNER_RADIUS = 12;

const PDF_FALLBACK_IMAGE = require('@/assets/images/pdf.jpeg');

const ScanFrameImage: React.FC<ScanFrameImageProps> = ({
    fileUri,
    frameWidthRatio = 0.8,
    frameHeightRatio = 0.62,
    IsPdf = false,
}) => {
    const { thumbUri, thumbFailed } = usePdfThumbnail(fileUri, IsPdf);
    const router = useRouter();
    const scanAnim = useRef(new Animated.Value(0)).current;
    const frameHeight = vScale(400) * frameHeightRatio;

    // Local fallback flag — catches cases where the hook reports success
    // (thumbUri is set) but the URI actually fails to load at render time
    // (stale cache path, deleted temp file, corrupt render, etc.)
    const [renderFailed, setRenderFailed] = useState(false);

    // Reset the local failure flag whenever the source file changes, so a
    // previous failure doesn't stick around and hide a valid new thumbnail.
    useEffect(() => {
        setRenderFailed(false);
    }, [fileUri, thumbUri]);

    const showPdfFallback = !IsPdf ? false : !thumbUri || thumbFailed || renderFailed;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: frameHeight,
                    duration: SCAN_DURATION_MS,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        loop.start();

        return () => loop.stop();
    }, [scanAnim, frameHeight]);

    return (
        <View style={styles.container}>
            {IsPdf ? (
                showPdfFallback ? (
                    <View style={styles.fallbackImageContainer}>
                        <Image
                            style={styles.fallbackImage}
                            source={PDF_FALLBACK_IMAGE}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <Image
                        style={StyleSheet.absoluteFillObject}
                        source={{ uri: thumbUri as string }}
                        resizeMode="cover"
                        onError={() => setRenderFailed(true)}
                    />
                )
            ) : (
                <Image
                    style={StyleSheet.absoluteFillObject}
                    source={{ uri: fileUri }}
                    resizeMode="cover"
                    onError={() => setRenderFailed(true)}
                />
            )}

            <View style={styles.dimOverlay} pointerEvents="none" />

            <TouchableOpacity
                style={styles.ArrowBackContainer}
                onPress={() => router.back()}
                hitSlop={{ top: 12, bottom: 8, left: 8, right: 8 }}
            >
                <AntDesign name="arrow-left" size={vScale(24)} color="#8A8A7C" />
            </TouchableOpacity>

            <View
                style={[
                    styles.frame,
                    { width: `${frameWidthRatio * 100}%`, height: frameHeight },
                ]}
                pointerEvents="none"
            >
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                <Animated.View
                    style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]}
                />
                <View style={styles.WhiteOverlay} pointerEvents="none" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#000',
        paddingHorizontal: vScale(20),
        paddingVertical: vScale(40),
    },
    dimOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    frame: {
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: '#FFFFFF',
    },
    cornerTL: {
        top: 0,
        left: 0,
        borderTopWidth: CORNER_THICKNESS,
        borderLeftWidth: CORNER_THICKNESS,
        borderTopLeftRadius: CORNER_RADIUS,
    },
    cornerTR: {
        top: 0,
        right: 0,
        borderTopWidth: CORNER_THICKNESS,
        borderRightWidth: CORNER_THICKNESS,
        borderTopRightRadius: CORNER_RADIUS,
    },
    cornerBL: {
        bottom: 0,
        left: 0,
        borderBottomWidth: CORNER_THICKNESS,
        borderLeftWidth: CORNER_THICKNESS,
        borderBottomLeftRadius: CORNER_RADIUS,
    },
    cornerBR: {
        bottom: 0,
        right: 0,
        borderBottomWidth: CORNER_THICKNESS,
        borderRightWidth: CORNER_THICKNESS,
        borderBottomRightRadius: CORNER_RADIUS,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#7CFFB2',
        shadowColor: '#7CFFB2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    WhiteOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    ArrowBackContainer: {
        position: 'absolute',
        top: vScale(32),
        left: vScale(16),
        zIndex: 10,
        backgroundColor: 'white',
        padding: vScale(8),
        borderRadius: vScale(28),
    },
    fallbackImageContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    fallbackImage: {
        width: vScale(420),
        height: vScale(420),
        resizeMode: "stretch",
    }
});

export default ScanFrameImage;