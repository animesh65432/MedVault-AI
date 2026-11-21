import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, Text, View } from "react-native"
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const Header: React.FC = () => {
    return (
        <View style={styles.Container}>
            <View style={styles.leftSide}>
                <MaterialIcons
                    name='arrow-back-ios'
                    size={scale(24)}
                />
                <Text style={styles.text}>Chat History</Text>
            </View>
            <Feather
                name="search"
                size={scale(28)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        paddingTop: vScale(10),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBlockColor: "#dcd5d5",
        borderBottomWidth: 1,
        paddingBottom: vScale(10),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(24),
    },
    leftSide: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(30)
    }
})

export default Header