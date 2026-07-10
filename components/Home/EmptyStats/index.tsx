import UpLoad from '@/components/UploadButtom'
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { Image, StyleSheet, View } from "react-native"
import Description from './DesScription'
import Steps from './Steps'

const EmptyStats: React.FC = () => {
    return (
        <View
            style={styles.container}
        >
            <Image
                style={styles.image}
                source={require("../../../assets/images/empty-stats.png")}
                resizeMode="cover"
            />
            <Description />
            <UpLoad />
            <Steps />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: vScale(9),
        gap: vScale(20),
    },
    image: {
        width: scale(200),
        height: vScale(200),
    },
})

export default EmptyStats