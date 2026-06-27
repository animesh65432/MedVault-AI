import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DocumentImage from './DocumentImage';

const STEPS = [
    { label: 'Uploading image...', delay: 0 },
    { label: 'Reading text...', delay: 2500 },
    { label: 'Analyzing document...', delay: 5000 },
    { label: 'Extracting information...', delay: 7500 },
];

const TIPS = [
    'We support Hindi, English, and 15+ other Indian languages!',
    'Keep the document flat and well-lit for best results.',
    'Prescriptions, bills, and IDs are all supported.',
];

type Props = {
    fileUri: string;
    fileName: string;
    fileType: string;
}

const DocumentScanning: React.FC<Props> = ({ fileUri, fileName, fileType }) => {
    const router = useRouter();

    const spinAnim = useRef(new Animated.Value(0)).current;
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [tipIndex, setTipIndex] = useState(0);
    const tipOpacity = useRef(new Animated.Value(1)).current;
    const stepAnims = useRef(STEPS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        STEPS.forEach((step, i) => {
            setTimeout(() => {
                Animated.timing(stepAnims[i], {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            }, step.delay);

            setTimeout(() => {
                setCompletedSteps(prev => [...prev, i]);
            }, step.delay + 1800);
        });

        const tipInterval = setInterval(() => {
            Animated.sequence([
                Animated.timing(tipOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(tipOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
            setTipIndex(prev => (prev + 1) % TIPS.length);
        }, 4000);

        const navTimeout = setTimeout(() => {
            router.replace({
                pathname: '/Dowload',
                params: { fileUri, fileName, fileType },
            });
        }, 12000);

        return () => {
            clearInterval(tipInterval);
            clearTimeout(navTimeout);
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Processing Document...</Text>
                <DocumentImage
                    fileType={fileType}
                    fileUri={fileUri}
                    fileName={fileName}
                />
                <View style={styles.stepsContainer}>
                    {STEPS.map((step, i) => {
                        const done = completedSteps.includes(i);
                        return (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.stepRow,
                                    {
                                        opacity: stepAnims[i],
                                        transform: [{
                                            translateY: stepAnims[i].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [8, 0],
                                            }),
                                        }],
                                    },
                                ]}
                            >
                                <View style={[styles.stepIcon, done && styles.stepIconDone]}>
                                    {done
                                        ? <MaterialIcons name="check" size={scale(13)} color="#fff" />
                                        : <View style={styles.stepDot} />
                                    }
                                </View>
                                <Text style={[styles.stepText, done && styles.stepTextDone]}>
                                    {step.label}
                                </Text>
                            </Animated.View>
                        );
                    })}
                </View>

                <Text style={styles.estimate}>This usually takes 10–15 seconds</Text>

                <Animated.View style={[styles.tipCard, { opacity: tipOpacity }]}>
                    <MaterialIcons name="lightbulb-outline" size={scale(16)} color="#064E3B" />
                    <Text style={styles.tipText}>{TIPS[tipIndex]}</Text>
                </Animated.View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(28),
        paddingTop: vScale(56),
        alignItems: 'center',
    },

    // Title
    title: {
        fontFamily: 'Aeonik-Bold',
        fontSize: scale(22),
        color: '#111',
        marginBottom: vScale(36),
        textAlign: 'center',
    },

    // Spinner
    spinnerWrapper: {
        marginBottom: vScale(40),
    },
    spinnerOuter: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        backgroundColor: '#F0FAF6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerInner: {
        position: 'absolute',
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        borderWidth: 3,
        borderColor: 'transparent',
        borderTopColor: '#064E3B',
        borderRightColor: '#6EE7B7',
    },
    spinnerArc: {
        width: scale(90),
        height: scale(90),
    },
    spinnerCenter: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#064E3B',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    // Steps
    stepsContainer: {
        width: '100%',
        gap: vScale(14),
        marginBottom: vScale(28),
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    stepIcon: {
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepIconDone: {
        backgroundColor: '#064E3B',
    },
    stepDot: {
        width: scale(7),
        height: scale(7),
        borderRadius: scale(4),
        backgroundColor: '#9CA3AF',
    },
    stepText: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(15),
        color: '#6B7280',
    },
    stepTextDone: {
        fontFamily: 'Aeonik-Medium',
        color: '#111',
    },
    estimate: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(13),
        color: '#9CA3AF',
        marginBottom: vScale(24),
        textAlign: 'center',
    },

    // Tip
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(8),
        backgroundColor: '#F0FAF6',
        borderRadius: scale(14),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
        width: '100%',
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    tipText: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(13),
        color: '#065F46',
        flex: 1,
        lineHeight: scale(19),
    },
    Image: {
        width: vScale(300),
        height: vScale(200),
        marginBottom: vScale(28)
    }
});

export default DocumentScanning;