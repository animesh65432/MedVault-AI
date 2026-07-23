import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Header: React.FC = () => {
    const insets = useSafeAreaInsets()

    return (
        <View
            style={[style.container, { paddingTop: insets.top + vScale(20) }]}
        >
            <Pressable
                hitSlop={10}
                onPress={() => router.back()}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={scale(28)}
                    color="#234338"
                />
            </Pressable>
            <View style={style.textWrap}>
                <Text style={style.title}>Ask AI</Text>
                <Text style={style.subtitle}>About your health, and your records</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(16),
        paddingBottom: vScale(14),
        gap: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: "#E5E4DD",
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Medium",
        color: "#213320",
    },
    subtitle: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Regular",
        color: "#5F5E5A",
        marginTop: vScale(2),
    },
})

export default Header