import React from 'react'
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import Description from './DesScription'
import UpLoad from '../Upload'
import { View, StyleSheet, ScrollView } from "react-native"
import { Image } from 'react-native'
import Steps from './Steps'

const EmptyStats = () => {
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Image
                style={styles.image}
                source={require("../../../assets/images/empty-stats.png")}
                resizeMode="cover"
            />
            <Description />
            <UpLoad />
            <Steps />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: vScale(32),
        gap: vScale(24),
    },
    image: {
        width: scale(200),
        height: vScale(200),
    },
})

export default EmptyStats