import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const COLORS = {
    dark: '#0D1F1C',
    darkGreen: '#234338',
    accent: '#8FBF3F',
    iconBg: '#C9E28A',
    subtitle: '#5C6B63',
    white: '#FFFFFF',
}


const Assistance: React.FC = () => {
    const router = useRouter()

    const redirect_to_chat = () => {
        router.push({
            pathname: "/Chat",
            params: {
                currentDocument: "false",
                documentId: undefined
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="pulse" size={scale(24)} color={COLORS.darkGreen} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Need Assistance?</Text>
                        <Text style={styles.subtitle}>
                            Our medical concierge is available 24/7 for your health queries.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPress={redirect_to_chat}
                >
                    <Ionicons name="chatbubble-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.buttonText}>Live Chat Support</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '95%',
        alignSelf: "center"
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: scale(20),
        paddingVertical: vScale(20),
        paddingHorizontal: scale(20),
        marginLeft: scale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.06,
        shadowRadius: scale(12),
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(14),
        marginBottom: vScale(18),
    },
    iconCircle: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        backgroundColor: COLORS.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: fs(17),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.dark,
        marginBottom: vScale(4),
    },
    subtitle: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Regular',
        color: COLORS.subtitle,
        lineHeight: fs(18),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        backgroundColor: COLORS.darkGreen,
        borderRadius: scale(14),
        paddingVertical: vScale(14),
    },
    buttonText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.white,
    },
})

export default Assistance