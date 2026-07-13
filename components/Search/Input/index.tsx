import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { StyleSheet, TextInput, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

type Props = {
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const InputBox: React.FC<Props> = ({ searchQuery, setSearchQuery }) => {
    return (
        <View style={styles.container}>
            <Ionicons
                name="search"
                size={scale(18)}
                color="#5A7A74"
            />
            <TextInput
                style={styles.input}
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholder="Search your medical history"
                placeholderTextColor="#5A7A74"
            />
        </View>
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
        paddingHorizontal: scale(8),
        paddingVertical: vScale(4),
        gap: scale(8),
        position: "sticky"
    },
    input: {
        flex: 1,
        fontFamily: "Aeonik-Regular",
        fontSize: scale(16),
        color: "#5A7A74",
    },
})

export default InputBox