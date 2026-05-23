import React from 'react'
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import Description from './DesScription'
import { View, StyleSheet } from "react-native"
import { Image } from 'react-native'

const EmptyStats = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require("../../../assets/images/empty-stats.png")}
                resizeMode="cover"
            />
            <Description />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0
    },
    image: {
        width: scale(300),
        height: vScale(300)
    }
})

export default EmptyStats