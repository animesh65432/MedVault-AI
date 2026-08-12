import BackButton from '@/components/BackButton'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { StyleSheet, Text, View } from 'react-native'

const Navbar = () => {
    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.text}>
                Medicine Details
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(20),
        backgroundColor: "white",
        paddingTop: scale(40),
        paddingBottom: scale(10),
        paddingHorizontal: scale(20)
    },
    text: {
        color: "#234338",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(19)
    }
})

export default Navbar