import React from 'react'
import { vScale } from "@/utils/vScale"
import { View, Text, StyleSheet } from "react-native"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"

const Empty = () => {
    return (
        <View style={styles.Container}>
            <SimpleLineIcons
                name="docs"
                size={vScale(45)}
                color="#23423B"
            />
            <Text style={styles.label}>No Documents Yet</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: "center",
    },
    label: {
        fontFamily: "Aeonik-Medium",
        fontSize: vScale(16),
        color: "#23423B",
        marginTop: vScale(12)
    }
})

export default Empty