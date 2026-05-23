import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, TouchableOpacity } from "react-native"

const UpLoad = () => {
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <MaterialIcons name="upload" size={scale(18)} color="#fff" />
            <Text style={styles.text}>Upload Document</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: vScale(15),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(6),
        backgroundColor: "#23423B",
        paddingVertical: vScale(12),
        paddingHorizontal: scale(24),
        borderRadius: scale(12),
        alignSelf: "center",
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(14),
        color: "#fff",
    }
})

export default UpLoad