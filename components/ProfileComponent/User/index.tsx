import { UserNameContext } from '@/context/UserName'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const COLORS = {
    dark: '#0D483F',
    lime: '#D9F99D',
};

const formatMemberSince = (date: Date | null): string => {
    if (!date) return ""
    return date.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
    })
}

const User: React.FC = () => {
    const { userName, Created } = useContext(UserNameContext)

    return (
        <View style={styles.AvatarContainer}>
            <LinearGradient
                colors={['#0D483F', '#234338']}
                style={styles.avatarRing}
            >
                <View style={styles.avatarCircle}>
                    {userName.trim().length === 0 ? (
                        <AntDesign name="user" size={scale(30)} color={COLORS.dark} />
                    ) : (
                        <Text style={styles.avatarInitial}>
                            {userName.trim().charAt(0).toUpperCase()}
                        </Text>
                    )}
                </View>
            </LinearGradient>
            <Text style={styles.UserName}>{userName}</Text>
            {Created && (
                <Text style={styles.CreatedAt}>Member since {formatMemberSince(Created)}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    AvatarContainer: {
        alignSelf: "center",
        alignItems: "center",
        gap: vScale(8),
    },
    avatarRing: {
        width: scale(94),
        height: scale(94),
        borderRadius: scale(47),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0D483F',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.18,
        shadowRadius: scale(10),
        elevation: 3,
    },
    avatarCircle: {
        width: scale(84),
        height: scale(84),
        borderRadius: scale(42),
        backgroundColor: COLORS.lime,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: fs(32),
        fontFamily: 'Aeonik-Bold',
        color: COLORS.dark,
    },
    UserName: {
        fontSize: fs(22),
        fontFamily: 'Aeonik-Medium',
        color: "#0D1F1C",
    },
    CreatedAt: {
        fontSize: fs(13),
        color: "#5C6B63",
        fontFamily: 'Aeonik-Regular',
    }
})

export default User