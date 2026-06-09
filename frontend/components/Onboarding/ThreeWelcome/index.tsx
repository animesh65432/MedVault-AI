import animation from "@/assets/animations/NeverMissUpdate/a/Main Scene.json"
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import LottieView from 'lottie-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    handlePageChange: (index: number) => void
}

const ThreeWelcome: React.FC<Props> = ({ handlePageChange }) => {
    return (
        <View style={styles.container}>

            {/* Progress dots */}
            <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotActive]} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Never Miss Your</Text>
                <Text style={styles.title}>Medicines</Text>
            </View>

            <Text style={styles.description}>
                Your medical records stay protected
                and available whenever you need them.
            </Text>
            <LottieView
                source={animation}
                autoPlay
                loop={true}
                style={styles.image}
            />
            <View style={styles.trustContainer}>
                <Text style={styles.trustTitle}>🔒 Private by Design</Text>
                <Text style={styles.trustText}>
                    Works offline. No login required.
                </Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePageChange(3)}
                activeOpacity={0.9}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handlePageChange(1)}
                activeOpacity={0.7}
            >
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: scale(24),
        paddingTop: vScale(30),
        paddingBottom: vScale(32),
        gap: vScale(0),
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(6),
    },
    dot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#C8DDD5',
    },
    dotActive: {
        width: scale(22),
        borderRadius: scale(4),
        backgroundColor: '#23423B',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        color: '#234338',
        fontSize: fs(26),
        textAlign: 'center',
        lineHeight: fs(32),
        fontFamily: 'Aeonik-Medium',
    },
    description: {
        color: '#6B6B6B',
        fontSize: fs(17),
        lineHeight: fs(22),
        textAlign: 'center',
        fontFamily: 'Aeonik-Medium',
        width: '95%',
        alignSelf: 'center',
    },
    image: {
        alignSelf: 'center',
        width: scale(500),
        height: vScale(400),
    },
    button: {
        backgroundColor: '#23423B',
        borderRadius: scale(10),
        paddingVertical: vScale(16),
        paddingHorizontal: scale(44),
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#23423B',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.25,
        shadowRadius: scale(8),
        elevation: 5,
    },
    buttonText: {
        fontSize: fs(16),
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Bold',
        letterSpacing: 0.3,
    },
    backText: {
        fontSize: fs(15),
        marginTop: vScale(16),
        color: '#6B6B6B',
        fontFamily: 'Aeonik-Regular',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    trustContainer: {
        alignItems: 'center',
        marginBottom: vScale(16),
    },

    trustTitle: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Bold',
        color: '#23423B',
    },

    trustText: {
        fontSize: fs(12),
        fontFamily: 'Aeonik-Regular',
        color: '#6B6B6B',
        marginTop: vScale(4),
    },
})

export default ThreeWelcome