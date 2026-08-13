import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { Feather, FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    IsPdf: boolean
    SourceFilePath: string
    title: string
    date: string
    handleViewOriginalPress: () => void
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

const Source: React.FC<Props> = ({ IsPdf, title, date, handleViewOriginalPress }) => {
    return (
        <TouchableOpacity style={style.Container} activeOpacity={0.7} onPress={handleViewOriginalPress}>
            <View style={style.iconWrap}>
                <FontAwesome
                    name={IsPdf ? "file-pdf-o" : "photo"}
                    size={fs(18)}
                    color="#234338"
                />
            </View>

            <View style={style.textWrap}>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={style.date}>{formatDate(date)}</Text>
            </View>

            <Feather name="chevron-right" size={fs(16)} color="white" />
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    Container: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        backgroundColor: "#0D483F",
        borderRadius: scale(12),
        padding: scale(12),
        marginHorizontal: scale(10),
    },
    iconWrap: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(10),
        backgroundColor: "#EEF6A2",
        alignItems: "center",
        justifyContent: "center",
    },
    textWrap: {
        flex: 1,
        gap: scale(2),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13),
        color: "white",
    },
    date: {
        fontFamily: "Aeonik-Regular",
        fontSize: fs(12),
        color: "white",
    },
})

export default Source