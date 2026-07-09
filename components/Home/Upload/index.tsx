import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UpLoad: React.FC = () => {
    const router = useRouter();

    const pickAndUpload = () => {
        router.push("/UploadModal");
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(6),
        backgroundColor: "#23423B",
        paddingVertical: vScale(16),
        paddingHorizontal: scale(34),
        borderRadius: scale(12),
        alignSelf: "center",
        width: "100%"
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#EEF6A2",
    }
})

export default UpLoad