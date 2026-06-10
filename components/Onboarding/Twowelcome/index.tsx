import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { fs } from '@/utils/fs'
import LottieView from 'lottie-react-native'
import animation from "@/assets/animations/Documents/animations/embedded.json";


type Props = {
    handlePageChange: (index: number) => void
}

const TwoWelCome: React.FC<Props> = ({ handlePageChange }) => {
    return (
        <View style={styles.container}>

            <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Find Any Report</Text>
                <Text style={styles.title}>In Seconds</Text>
            </View>

            <Text style={styles.description}>
                Search prescriptions, blood tests,
                scans, and bills instantly using
                smart document search.
            </Text>
            <View style={styles.animationWrapper}>
                <LottieView
                    source={animation}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.buttonRow}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePageChange(2)}
                    activeOpacity={0.9}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

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
        gap: vScale(20),
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
        height: vScale(480),
    },
    buttonRow: {
        flexDirection: 'row',
        gap: scale(12),
        justifyContent: 'center',
        width: "90%",
        alignSelf: 'center',
    },
    button: {
        flex: 1,
        backgroundColor: '#23423B',
        borderRadius: scale(10),
        paddingVertical: vScale(16),
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
    buttonOutline: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#23423B',
        borderRadius: scale(10),
        paddingVertical: vScale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonOutlineText: {
        fontSize: fs(16),
        color: '#23423B',
        fontFamily: 'Aeonik-Bold',
        letterSpacing: 0.3,
    },
    animationWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    animation: {
        width: '100%',
        height: '100%',
    },
})

export default TwoWelCome