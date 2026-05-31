import { scale } from '@/utils/scale'
import * as DocumentPicker from 'expo-document-picker';
import { vScale } from '@/utils/vScale'
import React from 'react'
import { useRouter } from "expo-router"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, TouchableOpacity } from "react-native"

const UpLoad = () => {
    const router = useRouter();

    const pickAndUpload = () => {
        router.push('/UploadModal')
    };

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={pickAndUpload}
        >
            <MaterialIcons name="camera-alt"
                size={scale(18)}
                color="#EEF6A2"
            />
            <Text style={styles.text}>Upload Document</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: vScale(19),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(6),
        backgroundColor: "#23423B",
        paddingVertical: vScale(16),
        paddingHorizontal: scale(34),
        borderRadius: scale(12),
        alignSelf: "center",
        width: "90%",
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#EEF6A2",
    }
})

export default UpLoad