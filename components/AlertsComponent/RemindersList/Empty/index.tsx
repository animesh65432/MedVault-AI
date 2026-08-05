import { fs } from "@/utils/fs"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

const Empty: React.FC = () => {
    return (
        <View style={styles.Container}>
            <Text style={styles.text}>No Upcoming Alerts </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(18)
    }
})
export default Empty