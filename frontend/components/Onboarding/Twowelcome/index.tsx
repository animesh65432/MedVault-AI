import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { fs } from '@/utils/fs'

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
                <Text style={styles.title}>Find Any Medical</Text>
                <Text style={styles.title}>Record Instantly</Text>
            </View>

            <Text style={styles.description}>
                Search medicines, doctors, hospitals, symptoms, or dates
                using smart AI-powered search.
            </Text>

            <Image
                style={styles.image}
                source={require('../../../assets/images/Hero-2.png')}
                resizeMode="contain"
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.buttonOutline}
                    onPress={() => handlePageChange(0)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonOutlineText}>Back</Text>
                </TouchableOpacity>

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
        paddingHorizontal: scale(4),
        paddingTop: vScale(3),
        paddingBottom: vScale(3),
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
    buttonRow: {
        flexDirection: 'row',
        gap: scale(12),
        justifyContent: 'center',
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
})

export default TwoWelCome