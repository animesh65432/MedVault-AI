import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const EmptyRecords: React.FC = () => {
    return (
        <View style={style.container}>
            <AntDesign
                name="folder-open"
                size={scale(45)}
                color="#082e28"
            />
            <Text style={style.text}>No Records Found</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: "flex",
        gap: vScale(6),
    },
    text: {
        fontSize: fs(20),
        fontFamily: 'Aeonik-Medium',
        color: '#082e28',
    }
})

export default EmptyRecords