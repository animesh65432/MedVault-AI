import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const UploadButtom: React.FC = () => {
    const router = useRouter();

    const pickAndUpload = () => {
        router.push("/UploadModal");
    };

    return (
        <Animated.View
            entering={FadeInDown
                .duration(400)
                .delay(450)
            }
            style={styles.uploadContainer}
        >
            <TouchableOpacity
                style={styles.uploadButton}
                activeOpacity={0.85}
                onPress={pickAndUpload}
            >
                <MaterialIcons name="camera-alt"
                    size={scale(18)}
                    color="white"
                />
                <Text style={styles.uploadText}>Upload Document</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    uploadContainer: {
        width: "100%",
    },
    uploadButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(8),
        backgroundColor: "#23423B",
        borderRadius: scale(14),
        paddingVertical: vScale(18),
        paddingHorizontal: scale(24),
        width: "100%",
        marginTop: vScale(8)
    },
    uploadText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "white",
    },
})

export default UploadButtom