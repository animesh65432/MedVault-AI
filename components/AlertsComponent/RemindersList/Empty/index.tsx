import { fs } from "@/utils/fs"
import { vScale } from "@/utils/vScale"
import { Entypo } from "@expo/vector-icons"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

const Empty: React.FC = () => {
    return (
        <View style={styles.Container}>
            <View
                style={styles.IconContainer}
            >
                <Entypo
                    name="calendar"
                    size={vScale(35)}
                    color="#0D483F"
                />
                <Text style={styles.text}>No Upcoming Alerts </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        marginTop: vScale(250)
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(24)
    },
    IconContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: vScale(15)
    }
})
export default Empty