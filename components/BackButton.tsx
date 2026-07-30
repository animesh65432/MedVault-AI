import { scale } from '@/utils/scale'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

const BackButton = () => {
    const router = useRouter()

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.replace('/')
        }
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
        >
            <Icon
                name="left"
                size={scale(24)}
                color="#234338"
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: scale(8),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E5E5",
        padding: scale(8),
    }
})

export default BackButton