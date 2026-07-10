import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const SeeAllDocuments: React.FC = () => {
    const router = useRouter()

    const handlePress = () => {
        router.push('/Search')
    }

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={handlePress}
        >
            <Text style={styles.text}>See All Documents</Text>
            <AntDesign name="arrow-right" size={scale(16)} color="#23423B" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(7),
        paddingVertical: vScale(10),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#23423B",
        textDecorationLine: "underline",
    },
})

export default SeeAllDocuments