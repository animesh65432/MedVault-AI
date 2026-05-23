import React, { useContext } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { fs } from '@/utils/fs'
import { User } from '@/context/User'

type Props = {
    onAuthSuccess: () => void
}

const Login: React.FC<Props> = ({ onAuthSuccess }) => {
    const { SignIn } = useContext(User)

    const handleGoogleSignIn = async () => {
        try {
            console.log('🚀 Initiating Google Sign In from Auth component...')

            console.log(SignIn())

        } catch (error) {
            console.error(error)
        }
    }


    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* Top content */}
                <View style={styles.topSection}>

                    <Text style={styles.title}>Your Medical Records,{'\n'}Always With You</Text>

                    <Text style={styles.description}>
                        Securely organize, search, and manage your
                        health documents in one place.
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonsSection}>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignIn}
                        activeOpacity={0.85}
                    >
                        {/* Replace with actual Google SVG icon */}
                        <Text style={styles.googleIcon}>G</Text>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                </View>

                {/* Terms */}
                <Text style={styles.terms}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms</Text>
                    {' '}&{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(24),
        paddingBottom: vScale(32),
        justifyContent: 'flex-end',
    },

    // Top section
    topSection: {
        marginBottom: vScale(40),
        gap: vScale(12),
    },
    badge: {
        backgroundColor: '#D4EAE3',
        borderRadius: scale(20),
        paddingVertical: vScale(6),
        paddingHorizontal: scale(14),
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#23423B',
        fontSize: fs(12),
        fontFamily: 'Aeonik-Medium',
    },
    title: {
        color: '#234338',
        fontSize: fs(28),
        lineHeight: fs(36),
        fontFamily: 'Aeonik-Bold',
    },
    description: {
        color: '#6B6B6B',
        fontSize: fs(15),
        lineHeight: fs(22),
        fontFamily: 'Aeonik-Regular',
    },

    // Buttons
    buttonsSection: {
        gap: vScale(12),
        marginBottom: vScale(20),
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(10),
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: scale(10),
        paddingVertical: vScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    googleIcon: {
        fontSize: fs(16),
        fontFamily: 'Aeonik-Bold',
        color: '#4285F4',
    },
    googleButtonText: {
        fontSize: fs(15),
        color: '#1A1A1A',
        fontFamily: 'Aeonik-Medium',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    dividerText: {
        color: '#9B9B9B',
        fontSize: fs(13),
        fontFamily: 'Aeonik-Regular',
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(10),
        backgroundColor: '#23423B',
        borderRadius: scale(10),
        paddingVertical: vScale(16),
        shadowColor: '#23423B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    emailIcon: {
        fontSize: fs(16),
        color: '#EEF6A2',
    },
    emailButtonText: {
        fontSize: fs(15),
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
    },

    // Terms
    terms: {
        color: '#9B9B9B',
        fontSize: fs(12),
        fontFamily: 'Aeonik-Regular',
        textAlign: 'center',
        lineHeight: fs(18),
    },
    termsLink: {
        color: '#23423B',
        textDecorationLine: 'underline',
        fontFamily: 'Aeonik-Medium',
    },
})

export default Login