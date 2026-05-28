import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { fs } from '@/utils/fs'

type Props = {
    handlePageChange: (index: number) => void
}

const WelCome: React.FC<Props> = ({ handlePageChange }) => {
    return (
        <View style={styles.container}>

            <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>All Your Medical Records.</Text>
                <Text style={styles.title}>One Safe Place.</Text>
            </View>

            <Text style={styles.description}>
                Store prescriptions, lab reports, scans, and hospital bills
                securely and access them anytime.
            </Text>

            <Image
                style={styles.image}
                width={scale(500)}
                height={vScale(450)}
                source={require('../../../assets/images/Hero-1.png')}
                resizeMode="contain"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePageChange(1)}
                activeOpacity={0.9}
            >
                <Text style={styles.buttonText}>Continue</Text>
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
        width: scale(600),
        height: vScale(640),
    },
    button: {
        backgroundColor: '#23423B',
        borderRadius: scale(10),
        paddingVertical: vScale(16),
        paddingHorizontal: scale(44),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#23423B',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.25,
        shadowRadius: scale(8),
        elevation: 5,
        width: "100%"
    },
    buttonText: {
        fontSize: fs(16),
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Bold',
        letterSpacing: 0.3,
    },
})

export default WelCome