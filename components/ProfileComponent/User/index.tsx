import { UserNameContext } from '@/context/UserName'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const COLORS = {
    dark: '#1B3B36',
    ring: '#CFE0D3'
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
            <View style={styles.avatarCircle}>
                {userName.trim().length === 0 ? (
                    <AntDesign
                        name="user"
                        size={scale(34)}
                        color={COLORS.dark}
                    />
                ) : (
                    <Text style={styles.avatarInitial}>
                        {userName.trim().charAt(0).toUpperCase()}
                    </Text>
                )}
            </View>
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: scale(6)
    },
    avatarCircle: {
        width: scale(88),
        height: scale(88),
        borderRadius: scale(44),
        backgroundColor: '#EAF1EA',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(4) },
        shadowOpacity: 0.08,
        shadowRadius: scale(10),
        elevation: 2,
    },
    avatarInitial: {
        fontSize: fs(34),
        fontWeight: '700',
        color: COLORS.dark,
    },
    UserName: {
        fontSize: fs(22),
        fontFamily: 'Aeonik-Medium',
        color: "#003730"
    },
    CreatedAt: {
        fontSize: fs(14),
        color: "#23423B",
        fontFamily: 'Aeonik-Regular'
    }
})

export default User