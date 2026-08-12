import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    timing: string[]
}

const Timing: React.FC<Props> = ({ timing }) => {
    if (!timing || timing.length === 0) return null

    return (
        <View style={style.Container}>
            {timing.map((time, index) => (
                <View key={index} style={style.chip}>
                    <Text style={style.chipText}>{time}</Text>
                </View>
            ))}
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(8),
        paddingHorizontal: scale(20),
    },
    chip: {
        backgroundColor: "#0D483F",
        borderRadius: scale(16),
    },
    chipText: {
        color: "#D9F99D",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
    }
})

export default Timing