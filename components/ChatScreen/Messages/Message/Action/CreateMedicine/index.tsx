import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const CreateMedicine: React.FC = () => {
    const router = useRouter();
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => router.push("/Medicines")}
            >
                <Text style={styles.text}>Yes , Create Medicine</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.secondaryButton}
            >
                <Text style={styles.secondaryText}>No, Thanks</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-end",
        backgroundColor: "#234338",
        paddingVertical: vScale(12),
        paddingHorizontal: scale(18),
        borderRadius: scale(30),
        marginTop: vScale(10),
        marginBottom: vScale(8),
        elevation: 4,
    },
    text: {
        color: "white",
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
    },
    buttonContainer: {
        flexDirection: "row",
        gap: scale(10),
    },
    secondaryButton: {
        padding: scale(14),
        borderRadius: scale(30),
        marginTop: vScale(10),
        marginBottom: vScale(8),
        elevation: 10,
        borderWidth: 1,
        borderColor: "#234338",
        backgroundColor: "white",
    },
    secondaryText: {
        color: "#234338",
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        textAlign: "center",
    },
    primaryButton: {
        backgroundColor: "#234338",
        padding: scale(14),
        borderRadius: scale(30),
        marginTop: vScale(10),
        marginBottom: vScale(8),
        elevation: 10,
    }
})

export default CreateMedicine