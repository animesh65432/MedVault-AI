import { Model } from "@/services/model";
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ResourceFetcher } from "react-native-executorch";
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type DownloadState = 'idle' | 'downloading' | 'complete' | 'error';

const MS_PER_FRAME = 1000 / 60;

const DownloadModel = () => {
    const [downloadState, setDownloadState] = useState<DownloadState>('idle');
    const [progress, setProgress] = useState(0);
    const [availableGB, setAvailableGB] = useState<string | null>(null);

    const progressAnim = useRef(new Animated.Value(0)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;
    const spinLoop = useRef<Animated.CompositeAnimation | null>(null);

    const lastReportedPercent = useRef(-1);
    const lastReportTime = useRef(Date.now());
    const downloadDone = useRef(false);

    useEffect(() => {
        FileSystem.getFreeDiskStorageAsync()
            .then(free => setAvailableGB(`${(free / 1_073_741_824).toFixed(1)} GB`))
            .catch(() => setAvailableGB('Unknown'));
    }, []);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    }, [progress]);

    useEffect(() => {
        if (downloadState === 'downloading') {
            spinLoop.current = Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
            spinLoop.current.start();
        } else {
            spinLoop.current?.stop();
            spinAnim.setValue(0);
        }
    }, [downloadState]);

    useEffect(() => {
        if (downloadState === 'complete') {
            Animated.spring(checkScale, {
                toValue: 1,
                friction: 5,
                tension: 120,
                useNativeDriver: true,
            }).start();
        }
    }, [downloadState]);

    const startDownload = async () => {
        const net = await NetInfo.fetch();

        if (!net.isConnected) {
            Toast.show({
                type: 'defaultToast',
                text1: 'No internet connection.',
                text2: 'Connect to the internet and try again.',
            });
            return;
        }

        if (net.type !== 'wifi') {
            Toast.show({
                type: 'defaultToast',
                text1: 'Not on WiFi',
                text2: 'This download is ~1 GB. Mobile data charges may apply.',
            });
        }

        lastReportedPercent.current = -1;
        lastReportTime.current = Date.now();
        downloadDone.current = false;

        setDownloadState('downloading');
        setProgress(0);

        try {
            const result = await ResourceFetcher.fetch(
                (p: number) => {
                    const currentPercent = Math.floor(p * 100);
                    if (
                        !downloadDone.current &&
                        currentPercent !== lastReportedPercent.current &&
                        lastReportTime.current + MS_PER_FRAME < Date.now()
                    ) {
                        lastReportedPercent.current = currentPercent;
                        lastReportTime.current = Date.now();
                        setProgress(p);
                    }
                },
                Model.modelPath,
                Model.tokenizerPath,
                Model.tokenizerConfigPath,
            );

            if (result === null) return;

            downloadDone.current = true;
            setProgress(1);
            setDownloadState('complete');
        } catch (err) {
            console.error('Model download failed:', err);
            downloadDone.current = true;
            setDownloadState('error');
            Toast.show({
                type: 'error',
                text1: 'Download failed',
                text2: 'Something went wrong. Please try again.',
            });
        }
    };

    const isIdle = downloadState === 'idle';
    const isDownloading = downloadState === 'downloading';
    const isComplete = downloadState === 'complete';
    const isError = downloadState === 'error';
    const pct = Math.round(progress * 100);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });
    const spinRotate = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const btnLabel = isDownloading
        ? `Downloading… ${pct}%`
        : isComplete
            ? 'Model ready'
            : isError
                ? 'Retry download'
                : 'Download model';

    const btnStyle = [
        styles.btnPrimary,
        isDownloading && styles.btnDisabled,
        isComplete && styles.btnSuccess,
        isError && styles.btnError,
    ];

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={styles.titleRow}>
                    <Icon name="lock-outline" size={scale(24)} color="#234338" />
                    <Text style={styles.title}>Enable offline AI</Text>
                </View>
                <Text style={styles.description}>
                    Download an AI model to use MedVault without an internet connection.
                </Text>
            </View>

            <View style={styles.modelCard}>
                <View style={styles.modelHeader}>
                    <View style={styles.modelIconWrap}>
                        <Icon name="robot-outline" size={scale(22)} color="#0F6E56" />
                    </View>
                    <View style={styles.modelInfo}>
                        <Text style={styles.modelName}>Qwen3 · 1.7B</Text>
                        <Text style={styles.modelMeta}>Language · Fully private</Text>
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
                        <Text style={[styles.badgeText, styles.badgeTextGray]}>~1 GB</Text>
                    </View>
                </View>

                {(isDownloading || isComplete) && (
                    <View style={styles.progressArea}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.progressStatus}>
                                {isComplete ? 'Download complete' : 'Downloading model…'}
                            </Text>
                            <Text style={styles.progressPct}>{pct}%</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                        </View>
                        {isComplete && (
                            <Text style={styles.speedLabel}>Model ready to use offline</Text>
                        )}
                    </View>
                )}

                {isError && (
                    <View style={styles.errorRow}>
                        <Icon name="alert-circle-outline" size={scale(14)} color="#A32D2D" />
                        <Text style={styles.errorText}>
                            Download failed. Check your connection and try again.
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Storage required</Text>
                    <Text style={styles.statValue}>~1 GB</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Available</Text>
                    <Text style={styles.statValue}>{availableGB ?? 'Checking…'}</Text>
                </View>
            </View>

            <View style={styles.infoNote}>
                <Icon name="information-outline" size={scale(16)} color="#0F6E56" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                    All AI processing happens on your device. Your medical documents never leave your phone.
                </Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={btnStyle}
                    onPress={startDownload}
                    activeOpacity={0.85}
                    disabled={isDownloading || isComplete}
                >
                    {isDownloading ? (
                        <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
                            <Icon name="loading" size={scale(18)} color="#fff" />
                        </Animated.View>
                    ) : isComplete ? (
                        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                            <Icon name="check" size={scale(18)} color="#fff" />
                        </Animated.View>
                    ) : (
                        <Icon
                            name={isError ? 'refresh' : 'download-outline'}
                            size={scale(18)}
                            color="#fff"
                        />
                    )}
                    <Text style={styles.btnPrimaryText}>{btnLabel}</Text>
                </TouchableOpacity>

                {(isIdle || isError) && (
                    <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                        <Text style={styles.btnSecondaryText}>Maybe later</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: vScale(50),
        paddingBottom: vScale(52),
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
    buttonGroup: {
        gap: vScale(10),
        marginTop: 'auto',
        paddingBottom: vScale(30),
    },
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
});

export default DownloadModel;