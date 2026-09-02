import UpLoad from '@/components/UploadButtom'
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { Image, StyleSheet, View } from "react-native"
import Animated, { ZoomIn } from 'react-native-reanimated'
import Description from './DesScription'
import Header from './Header'
import Steps from './Steps'

const EmptyStats: React.FC = () => {
    return (
        <View
            style={styles.container}
        >
            <Header />
            <Animated.View
                entering={ZoomIn
                    .duration(500)
                    .delay(150)
                }
            >
                <Image
                    style={styles.image}
                    source={require("../../../assets/images/empty-stats.png")}
                    resizeMode="cover"
                />
            </Animated.View>
            <Description />
            <UpLoad />
            <Steps />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: vScale(10),
        paddingHorizontal: scale(20),
        paddingTop: vScale(40),
        paddingBottom: vScale(32),
    },
    image: {
        width: scale(250),
        height: vScale(200),
    },
})

export default EmptyStats