import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { StyleSheet, View } from "react-native"
import Header from './Header'
import HeroSection from "./HeroSection"
import Steps from "./Steps"
import UploadButtom from "./UploadButtom"

const EmptyStats: React.FC = () => {
    return (
        <View
            style={styles.container}
        >
            <Header />
            <HeroSection />
            <UploadButtom />
            <Steps />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: vScale(5),
        paddingHorizontal: scale(20),
        paddingTop: vScale(40),
        paddingBottom: vScale(32),
        backgroundColor: "#F6F5EE"
    },
    image: {
        width: scale(250),
        height: vScale(150),
    },
})

export default EmptyStats