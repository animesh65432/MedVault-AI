import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const AddDocument: React.FC = () => {
    const router = useRouter()
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/UploadModal")}
            >
                <Text style={styles.primaryText}>Yes, Add Document</Text>
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
    buttonContainer: {
        flexDirection: "row",
        gap: scale(10),
    },
    primaryButton: {
        backgroundColor: "#234338",
        padding: scale(14),
        borderRadius: scale(30),
        marginTop: vScale(10),
        marginBottom: vScale(8),
        elevation: 10,
    },
    primaryText: {
        color: "white",
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
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
})

export default AddDocument