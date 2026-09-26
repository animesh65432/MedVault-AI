import UserIcon from '@/components/UserIcon';
import { UserNameContext } from '@/context/UserName';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    remindersCount: number;
}

const Header: React.FC<Props> = ({ remindersCount }) => {
    const router = useRouter();
    const { profilePic, userName } = useContext(UserNameContext);

    const getFirstName = (name: string, maxLength = 20): string => {
        const firstName = name.trim().split(/\s+/)[0] ?? '';

        if (!firstName) return '';

        const formatted =
            firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

        return formatted.length > maxLength
            ? `${formatted.slice(0, maxLength - 1)}…`
            : formatted;
    };


    return (
        <View style={styles.container}>
            <View style={styles.NameContainer}>
                <UserIcon />
                <Text style={styles.greeting}>Hello,{getFirstName(userName)}</Text>
            </View>
            <TouchableOpacity
                style={styles.NotificationIconContainer}
                onPress={() => router.push("/Alerts")}
            >
                {remindersCount > 0 ?
                    <View
                        style={styles.dotIcon}
                    /> : null
                }
                <Ionicons
                    name="notifications"
                    size={scale(18)}
                    color="#0D483F"
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    greeting: {
        fontSize: fs(19),
        fontFamily: 'Aeonik-Medium',
        color: '#0D483F'
    },
    NameContainer: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10)
    },
    ProfilePic: {
        width: scale(35),
        height: vScale(35),
        borderRadius: scale(20)
    },
    NotificationIconContainer: {
        backgroundColor: "#e7e7e4",
        padding: scale(9),
        borderRadius: scale(16),
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    dotIcon: {
        position: "absolute",
        top: scale(4),
        right: scale(4),
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: "#0D483F"
    }
})
export default Header