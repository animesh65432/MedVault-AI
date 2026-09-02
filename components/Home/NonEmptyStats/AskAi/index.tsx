import { scale } from '@/utils/scale'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

const AskAi: React.FC = () => {
    const router = useRouter()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.container}
            onPress={() => router.push('/Chat')}
        >
            <View style={styles.StarIconContainer}>
                <Icon
                    name="star"
                    size={scale(18)}
                    color="#DFFF55"
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Ask your medical history
                </Text>

                <Text
                    style={styles.description}
                    numberOfLines={1}
                >
                    "Find my last prescription"
                </Text>
            </View>
            <View style={styles.arrowContainer}>
                <Icon
                    name="arrow-right"
                    size={scale(20)}
                    color="#23423B"
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFEED7',
        borderRadius: scale(16),

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: scale(14),
        paddingVertical: scale(12),

        gap: scale(12),
    },

    StarIconContainer: {
        width: scale(44),
        height: scale(44),

        borderRadius: scale(12),

        backgroundColor: '#23423B',

        justifyContent: 'center',
        alignItems: 'center',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        fontSize: scale(15),
        fontWeight: '600',
        color: '#23423B',
        marginBottom: scale(3),
    },

    description: {
        fontSize: scale(13),
        color: '#60756E',
    },

    arrowContainer: {
        width: scale(40),
        height: scale(40),

        borderRadius: scale(20),

        backgroundColor: '#E8FF65',

        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default AskAi