import { QwenModelDowloadUrl } from '@/config'
import { DownloadContext } from "@/context/DownloadModel"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import * as FileSystem from 'expo-file-system/legacy'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type DownloadState = 'idle' | 'downloading' | 'complete' | 'error'

const MODEL_SIZE_MB = 1100
const MODEL_FILE_NAME = 'qwen2.5-1.5b.gguf'

const formatSpeed = (bytesPerSec: number): string => {
    if (bytesPerSec >= 1_048_576) return `${(bytesPerSec / 1_048_576).toFixed(1)} MB/s`
    if (bytesPerSec >= 1024) return `${(bytesPerSec / 1024).toFixed(0)} KB/s`
    return `${bytesPerSec.toFixed(0)} B/s`
}

const formatETA = (remainingBytes: number, bytesPerSec: number): string => {
    if (bytesPerSec <= 0) return ''
    const secs = remainingBytes / bytesPerSec
    if (secs < 60) return `${Math.ceil(secs)}s remaining`
    if (secs < 3600) return `${Math.ceil(secs / 60)} min remaining`
    return `${(secs / 3600).toFixed(1)} hr remaining`
}

const DownloadModel = () => {
    const { OnChangeModel } = useContext(DownloadContext)
    const [dlState, setDlState] = useState<DownloadState>('idle')
    const [progress, setProgress] = useState(0)
    const [speedLabel, setSpeedLabel] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [availableGB, setAvailableGB] = useState<string | null>(null)

    const progressAnim = useRef(new Animated.Value(0)).current
    const spinAnim = useRef(new Animated.Value(0)).current
    const checkScale = useRef(new Animated.Value(0)).current

    const lastSnapshot = useRef<{ bytes: number; time: number } | null>(null)
    const downloadResumableRef = useRef<FileSystem.DownloadResumable | null>(null)

    const modelUri = FileSystem.documentDirectory + MODEL_FILE_NAME

    useEffect(() => {
        ; (async () => {
            try {
                const free = await FileSystem.getFreeDiskStorageAsync()
                setAvailableGB(`${(free / 1_073_741_824).toFixed(1)} GB`)

            } catch {
                setAvailableGB('Unknown')
            }

            try {
                const info = await FileSystem.getInfoAsync(modelUri)

                console.log('Model file info:', info)

                if (info.exists) {
                    progressAnim.setValue(1)
                    setProgress(1)
                    setDlState('complete')
                    OnChangeModel(true)
                }
            } catch { /* ignore */ }
        })()

        return () => {
            downloadResumableRef.current?.pauseAsync().catch(() => { })
        }
    }, [])

    // ── Spinner ──
    useEffect(() => {
        if (dlState === 'downloading') {
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start()
        } else {
            spinAnim.stopAnimation()
            spinAnim.setValue(0)
        }
    }, [dlState])

    useEffect(() => {
        if (dlState === 'complete') {
            Animated.spring(checkScale, {
                toValue: 1,
                friction: 5,
                tension: 120,
                useNativeDriver: true,
            }).start()
        }
    }, [dlState])

    const animateProgressTo = (value: number) => {
        Animated.timing(progressAnim, {
            toValue: value,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start()
    }

    const startDownload = async () => {
        if (dlState !== 'idle' && dlState !== 'error') return

        setDlState('downloading')
        setProgress(0)
        setErrorMsg('')
        setSpeedLabel('')
        progressAnim.setValue(0)
        checkScale.setValue(0)
        lastSnapshot.current = null

        try {
            const resumable = FileSystem.createDownloadResumable(
                QwenModelDowloadUrl,
                modelUri,
                {},
                ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
                    const ratio = totalBytesExpectedToWrite > 0
                        ? totalBytesWritten / totalBytesExpectedToWrite
                        : 0

                    setProgress(ratio)
                    animateProgressTo(ratio)

                    const now = Date.now()
                    if (lastSnapshot.current) {
                        const dt = (now - lastSnapshot.current.time) / 1000
                        const db = totalBytesWritten - lastSnapshot.current.bytes
                        if (dt > 0.5) {
                            const bps = db / dt
                            const remaining = totalBytesExpectedToWrite - totalBytesWritten
                            setSpeedLabel(`${formatSpeed(bps)} · ${formatETA(remaining, bps)}`)
                            lastSnapshot.current = { bytes: totalBytesWritten, time: now }
                        }
                    } else {
                        lastSnapshot.current = { bytes: totalBytesWritten, time: now }
                    }
                }
            )

            downloadResumableRef.current = resumable

            const result = await resumable.downloadAsync()
            if (!result) throw new Error('Download returned no result')


            animateProgressTo(1)
            setProgress(1)
            setTimeout(() => setDlState('complete'), 400)

        } catch (err: any) {
            if (err?.message?.includes('paused')) return
            setDlState('error')
            setErrorMsg(err?.message ?? 'Download failed. Tap to retry.')
        }
    }

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    })

    const spinRotate = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    const pct = Math.round(progress * 100)

    return (
        <View style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.titleContainer}>
                <View style={styles.titleRow}>
                    <Icon name="lock-outline" size={scale(24)} color="#234338" />
                    <Text style={styles.title}>Enable offline AI</Text>
                </View>
                <Text style={styles.description}>
                    Download an AI model to use MedVault without an internet connection.
                </Text>
            </View>

            {/* ── Model card ── */}
            <View style={styles.modelCard}>
                <View style={styles.modelHeader}>
                    <View style={styles.modelIconWrap}>
                        <Icon name="robot-outline" size={scale(22)} color="#0F6E56" />
                    </View>
                    <View style={styles.modelInfo}>
                        <Text style={styles.modelName}>Qwen 2.5 · 1.5B</Text>
                        <Text style={styles.modelMeta}>Offline AI · Fully private</Text>
                    </View>
                </View>

                <View style={styles.badgeRow}>
                    <View style={[styles.badge, styles.badgeGreen]}>
                        <Icon name="shield-check-outline" size={scale(11)} color="#0F6E56" />
                        <Text style={[styles.badgeText, styles.badgeTextGreen]}>On-device</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeGreen]}>
                        <Icon name="wifi-off" size={scale(11)} color="#0F6E56" />
                        <Text style={[styles.badgeText, styles.badgeTextGreen]}>Works offline</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeGray]}>
                        <Text style={[styles.badgeText, styles.badgeTextGray]}>~{MODEL_SIZE_MB} MB</Text>
                    </View>
                </View>

                {(dlState === 'downloading' || dlState === 'complete') && (
                    <View style={styles.progressArea}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.progressStatus}>
                                {dlState === 'complete' ? 'Download complete' : 'Downloading…'}
                            </Text>
                            <Text style={styles.progressPct}>{pct}%</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                        </View>
                        <Text style={styles.speedLabel}>
                            {dlState === 'complete' ? 'Model ready to use offline' : speedLabel}
                        </Text>
                    </View>
                )}

                {dlState === 'error' && (
                    <View style={styles.errorRow}>
                        <Icon name="alert-circle-outline" size={scale(14)} color="#A32D2D" />
                        <Text style={styles.errorText}>{errorMsg || 'Download failed. Tap to retry.'}</Text>
                    </View>
                )}
            </View>

            {/* ── Stats ── */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Storage required</Text>
                    <Text style={styles.statValue}>~{MODEL_SIZE_MB} MB</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Available</Text>
                    <Text style={styles.statValue}>{availableGB ?? 'Checking…'}</Text>
                </View>
            </View>

            {/* ── Privacy note ── */}
            <View style={styles.infoNote}>
                <Icon name="information-outline" size={scale(16)} color="#0F6E56" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                    All AI processing happens on your device. Your medical documents never leave your phone.
                </Text>
            </View>

            {/* ── CTA ── */}
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[
                        styles.btnPrimary,
                        dlState === 'downloading' && styles.btnDisabled,
                        dlState === 'complete' && styles.btnSuccess,
                        dlState === 'error' && styles.btnError,
                    ]}
                    onPress={startDownload}
                    activeOpacity={0.85}
                    disabled={dlState === 'downloading'}
                >
                    {dlState === 'downloading' ? (
                        <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
                            <Icon name="loading" size={scale(18)} color="#fff" />
                        </Animated.View>
                    ) : dlState === 'complete' ? (
                        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                            <Icon name="check" size={scale(18)} color="#fff" />
                        </Animated.View>
                    ) : dlState === 'error' ? (
                        <Icon name="refresh" size={scale(18)} color="#fff" />
                    ) : (
                        <Icon name="download-outline" size={scale(18)} color="#fff" />
                    )}
                    <Text style={styles.btnPrimaryText}>
                        {dlState === 'idle'
                            ? 'Download model'
                            : dlState === 'downloading'
                                ? 'Downloading…'
                                : dlState === 'error'
                                    ? 'Retry download'
                                    : 'Model ready'}
                    </Text>
                </TouchableOpacity>

                {(dlState === 'idle' || dlState === 'error') && (
                    <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                        <Text style={styles.btnSecondaryText}>Maybe later</Text>
                    </TouchableOpacity>
                )}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: vScale(50),
        paddingBottom: vScale(32),
        gap: vScale(24),
    },
    titleContainer: { gap: vScale(8) },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8) },
    title: { fontSize: scale(20), color: '#234338', fontFamily: 'Aeonik-Medium' },
    description: {
        fontSize: scale(14),
        color: '#666',
        fontFamily: 'Aeonik-Regular',
        lineHeight: scale(20),
    },
    modelCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: scale(14),
        padding: scale(18),
        gap: vScale(14),
    },
    modelHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(10) },
    modelIconWrap: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(10),
        backgroundColor: '#E1F5EE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modelInfo: { flex: 1 },
    modelName: { fontSize: scale(15), fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
    modelMeta: {
        fontSize: scale(12),
        fontFamily: 'Aeonik-Regular',
        color: '#666',
        marginTop: vScale(2),
    },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(6) },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingHorizontal: scale(8),
        paddingVertical: vScale(4),
        borderRadius: scale(20),
    },
    badgeGreen: { backgroundColor: '#E1F5EE' },
    badgeGray: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7' },
    badgeText: { fontSize: scale(11), fontFamily: 'Aeonik-Medium' },
    badgeTextGreen: { color: '#0F6E56' },
    badgeTextGray: { color: '#888' },
    progressArea: { gap: vScale(6) },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressStatus: { fontSize: scale(13), fontFamily: 'Aeonik-Medium', color: '#1D9E75' },
    progressPct: { fontSize: scale(12), fontFamily: 'Aeonik-Regular', color: '#666' },
    progressTrack: {
        height: vScale(6),
        backgroundColor: '#fff',
        borderRadius: 99,
        overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: '#1D9E75', borderRadius: 99 },
    speedLabel: { fontSize: scale(11), fontFamily: 'Aeonik-Regular', color: '#888' },
    errorRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
    errorText: { fontSize: scale(12), fontFamily: 'Aeonik-Regular', color: '#A32D2D', flex: 1 },
    statsRow: { flexDirection: 'row', gap: scale(10) },
    statCard: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: scale(10),
        padding: scale(14),
    },
    statLabel: {
        fontSize: scale(11),
        fontFamily: 'Aeonik-Regular',
        color: '#888',
        marginBottom: vScale(4),
    },
    statValue: { fontSize: scale(16), fontFamily: 'Aeonik-Medium', color: '#1A1A1A' },
    infoNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(8),
        backgroundColor: '#E1F5EE',
        borderRadius: scale(10),
        padding: scale(14),
    },
    infoIcon: { marginTop: vScale(1) },
    infoText: {
        flex: 1,
        fontSize: scale(12),
        fontFamily: 'Aeonik-Regular',
        color: '#0F6E56',
        lineHeight: scale(18),
    },
    buttonGroup: { gap: vScale(10), marginTop: 'auto' },
    btnPrimary: {
        height: vScale(52),
        backgroundColor: '#234338',
        borderRadius: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
    },
    btnDisabled: { backgroundColor: '#9FE1CB' },
    btnSuccess: { backgroundColor: '#1D9E75' },
    btnError: { backgroundColor: '#A32D2D' },
    btnPrimaryText: { fontSize: scale(15), fontFamily: 'Aeonik-Medium', color: '#fff' },
    btnSecondary: {
        height: vScale(48),
        borderRadius: scale(12),
        borderWidth: 0.5,
        borderColor: '#D3D1C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSecondaryText: { fontSize: scale(15), fontFamily: 'Aeonik-Regular', color: '#888' },
})

export default DownloadModel