import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";

const COLORS = {
    dark: '#1B3B36',
    cream: '#F5F3E7',
    gray: '#6B7280',
    border: '#D9DED9',
    borderFocus: '#1B3B36',
    ring: '#CFE0D3',
    bg: '#FFFFFF',
};

export default function NameInputScreen({
    onContinue,
}: {
    onContinue: (name: string) => void;
}) {
    const [name, setName] = useState('');
    const [focused, setFocused] = useState(false);
    const pressScale = useRef(new Animated.Value(1)).current;
    const underlineWidth = useRef(new Animated.Value(0.5)).current;

    const canContinue = name.trim().length > 0;

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(underlineWidth, {
            toValue: 1,
            duration: 220,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setFocused(false);
        Animated.timing(underlineWidth, {
            toValue: 0.5,
            duration: 220,
            useNativeDriver: false,
        }).start();
    };

    const handleContinue = () => {
        if (!canContinue) return;
        Animated.sequence([
            Animated.timing(pressScale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
            Animated.timing(pressScale, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start();
        onContinue(name.trim());
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.dots}>
                <View style={styles.dotInactive} />
                <View style={styles.dotInactive} />
                <View style={styles.dotInactive} />
                <View style={styles.dotActive} />
            </View>

            <View style={styles.content}>
                <View style={styles.avatarWrap}>
                    {/* decorative dashed rings — echoes the screen 2 illustration motif */}
                    <View style={styles.ringOuter} />
                    <View style={styles.ringInner} />
                    <View style={styles.avatarCircle}>
                        {name.trim().length === 0 ? (
                            <AntDesign name="user" size={scale(34)} color={COLORS.dark} />
                        ) : (
                            <Text style={styles.avatarInitial}>
                                {name.trim().charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </View>
                </View>

                <Text style={styles.title}>What's your name?</Text>
                <Text style={styles.subtitle}>
                    We'll use this to personalize your records.
                </Text>

                <View style={styles.inputWrap}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your name"
                        placeholderTextColor="#B7C0BA"
                        value={name}
                        onChangeText={setName}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoFocus
                        autoCapitalize="words"
                        returnKeyType="done"
                        onSubmitEditing={handleContinue}
                    />
                    <View style={styles.underlineTrack}>
                        <Animated.View
                            style={[
                                styles.underlineFill,
                                {
                                    width: underlineWidth.interpolate({
                                        inputRange: [0.5, 1],
                                        outputRange: ['50%', '100%'],
                                    }),
                                    backgroundColor: focused ? COLORS.borderFocus : COLORS.border,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Animated.View style={{ transform: [{ scale: pressScale }] }}>
                    <TouchableOpacity
                        style={[styles.button, !canContinue && styles.buttonDisabled]}
                        onPress={handleContinue}
                        disabled={!canContinue}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        <AntDesign name="arrow-right" size={fs(18)} color={COLORS.cream} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: scale(24),
        paddingTop: scale(20),
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(6),
        marginBottom: scale(10),
    },
    dotInactive: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#D6E3D9',
    },
    dotActive: {
        width: scale(22),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: COLORS.dark,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: scale(80),
    },
    avatarWrap: {
        width: scale(140),
        height: scale(140),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(28),
    },
    ringOuter: {
        position: 'absolute',
        width: scale(140),
        height: scale(140),
        borderRadius: scale(70),
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.ring,
    },
    ringInner: {
        position: 'absolute',
        width: scale(112),
        height: scale(112),
        borderRadius: scale(56),
        borderWidth: 1,
        borderColor: '#E4EDE6',
    },
    avatarCircle: {
        width: scale(88),
        height: scale(88),
        borderRadius: scale(44),
        backgroundColor: '#EAF1EA',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.08,
        shadowRadius: scale(10),
        elevation: 2,
    },
    avatarInitial: {
        fontSize: fs(34),
        fontWeight: '700',
        color: COLORS.dark,
    },
    title: {
        fontSize: fs(26),
        fontWeight: '700',
        color: COLORS.dark,
        textAlign: 'center',
        marginBottom: scale(8),
        fontFamily: 'Aeonik-Medium',
    },
    subtitle: {
        fontSize: fs(15),
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: fs(22),
        marginBottom: scale(40),
        paddingHorizontal: scale(20),
    },
    inputWrap: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        fontSize: fs(22),
        fontWeight: '600',
        color: COLORS.dark,
        textAlign: 'center',
        paddingVertical: scale(10),
    },
    underlineTrack: {
        width: '80%',
        height: scale(2),
        alignItems: 'center',
    },
    underlineFill: {
        height: scale(2),
        borderRadius: scale(1),
    },
    footer: {
        paddingBottom: scale(28),
    },
    button: {
        flexDirection: 'row',
        gap: scale(8),
        backgroundColor: COLORS.dark,
        borderRadius: scale(14),
        paddingVertical: scale(18),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.12,
        shadowRadius: scale(8),
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#B7C4BB',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: COLORS.cream,
        fontSize: fs(17),
        fontWeight: '700',
    },
});