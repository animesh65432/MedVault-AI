import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const InputBox = () => {
    const router = useRouter()

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
        >
            <Ionicons
                name="search"
                size={scale(18)}
                color="#5A7A74"
            />
            <Text style={styles.placeholder}>
                Search your medical history
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: "#E0E0DC",
        paddingHorizontal: scale(14),
        paddingVertical: vScale(16),
        gap: scale(8),
    },
    placeholder: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(16),
        color: "#5A7A74",
    },
})

export default InputBox