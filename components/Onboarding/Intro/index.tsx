import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

type Props = {
    skipToLastPage: () => void

}
const Intro: React.FC<Props> = ({ skipToLastPage }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View>
                <Text style={styles.title}>Health records,</Text>
                <Text style={styles.title}>finally</Text>
                <View style={styles.BelowContainer}>
                    <Text style={styles.title}>organized</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={skipToLastPage}
                    >
                        <MaterialIcons
                            name="arrow-forward-ios"
                            size={fs(30)}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    title: {
        color: '#1B3B36',
        fontSize: fs(50),
        fontFamily: "Aeonik-Medium",
    },
    BelowContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#1B3B36",
        padding: scale(14),
        borderRadius: scale(50),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: scale(80),
        height: scale(80),
    }
})

export default Intro