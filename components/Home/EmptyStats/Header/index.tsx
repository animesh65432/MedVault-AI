import { UserNameContext } from '@/context/UserName'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn } from "react-native-reanimated"

const Header: React.FC = () => {
    const { userName } = useContext(UserNameContext)

    return (
        <Animated.View
            style={styles.container}
            entering={FadeIn.duration(350)}
        >
            <View style={styles.titleAndDescriptionContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Hi {userName}</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>Keep every prescription, report and bill</Text>
                    <Text style={styles.description}> safe in one private place.</Text>
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: scale(5),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(25),
        color: '#0D483F',
    },
    description: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(16),
        color: '#7A7A6E',
    },
    avatar: {
        width: fs(40),
        height: fs(40),
        borderRadius: fs(20),
        backgroundColor: '#bcd9d2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(18),
        color: '#23423B',
    },
    titleAndDescriptionContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: vScale(7),
    },
    descriptionContainer: {
        display: "flex",
        flexDirection: "column",
        gap: scale(2),
    }
})

export default Header