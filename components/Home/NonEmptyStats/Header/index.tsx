import { UserNameContext } from '@/context/UserName'
import { fs } from '@/utils/fs'
import { GetFirstName } from "@/utils/getfirstName"
import { getGreeting } from "@/utils/getGreeting"
import { scale } from '@/utils/scale'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

const Header: React.FC = () => {
    const { userName } = useContext(UserNameContext)
    const date = new Date();

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.Name}>{GetFirstName(userName)} 👋</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{formattedDate} . your vault is up to date </Text>
                <View style={styles.clickContainer}>
                    <Icon name="check" size={scale(16)} color="white" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: scale(0),
    },
    greeting: {
        fontSize: fs(18),
        fontFamily: 'Aeonik-Regular',
        color: '#23423B',
        marginBottom: scale(2),
    },
    Name: {
        fontSize: fs(22),
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
    },
    date: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-thin',
        color: '#23423B',
        marginTop: scale(4),
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
    },
    clickContainer: {
        backgroundColor: "#87AE73",
        padding: scale(2),
        borderRadius: scale(14),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default Header