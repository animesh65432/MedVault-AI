import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { fs } from '@/utils/fs'

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
                Get reminders for every dose and stay on track
                with your treatment and recovery.
            </Text>

            <Image
                style={styles.image}
                source={require('../../../assets/images/Hero-3.png')}
                resizeMode="contain"
            />

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
        paddingHorizontal: scale(4),
        paddingTop: vScale(3),
        paddingBottom: vScale(2),
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
        fontSize: fs(15),
        lineHeight: fs(22),
        textAlign: 'center',
        fontFamily: 'Aeonik-Regular',
        width: '95%',
        alignSelf: 'center',
    },
    image: {
        alignSelf: 'center',
        width: scale(500),
        height: vScale(480),
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
        color: '#6B6B6B',
        fontFamily: 'Aeonik-Regular',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
})

export default ThreeWelcome