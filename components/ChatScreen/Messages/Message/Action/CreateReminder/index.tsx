import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const CreateReminder: React.FC = () => {
    const router = useRouter()
    return (
        <TouchableOpacity
            style={styles.Container}
            onPress={() => router.push("/Alerts")}
        >
            <Text style={styles.text}>Create Reminder</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    Container: {
        marginLeft: "auto",
        backgroundColor: "#234338",
        padding: scale(12),
        borderRadius: scale(30),
        marginTop: vScale(10),
        marginBottom: vScale(8),
        elevation: 10
    },
    text: {
        color: "#EEF6A2",
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15)
    }
})

export default CreateReminder