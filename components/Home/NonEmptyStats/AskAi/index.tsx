import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import Icon from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AskAi: React.FC = () => {
    const router = useRouter()
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.container}
            onPress={() => router.push('/Chat')}
        >
            <View style={styles.iconBadge}>
                <Icon name="star" size={scale(18)} color="#0D483F" />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Ask your medical history</Text>
                <Text style={styles.description} numberOfLines={1}>
                    "Find my last prescription"
                </Text>
            </View>

            <View style={styles.arrowBadge}>
                <Icon name="arrow-right" size={scale(16)} color="#D9F99D" />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0D483F',
        borderRadius: scale(18),

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: scale(14),
        paddingVertical: scale(12),

        gap: scale(12),
        shadowColor: '#0D483F',
        shadowOffset: { width: 0, height: scale(6) },
        shadowOpacity: 0.25,
        shadowRadius: scale(12),
        elevation: 4,
    },

    iconBadge: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(13),
        backgroundColor: '#D9F99D',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: '#EEF6A2',
        marginBottom: scale(3),
    },

    description: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Regular',
        color: 'rgba(238, 246, 162, 0.65)',
    },

    arrowBadge: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(217, 249, 157, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default AskAi