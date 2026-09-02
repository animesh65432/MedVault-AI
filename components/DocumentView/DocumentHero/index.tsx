
import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { ImageBackground, StyleSheet, View } from "react-native"

type Props = {
    isPdf: boolean
    sourceFilePath: string
}

const DocumentHero: React.FC<Props> = ({ isPdf, sourceFilePath }) => {
    const { thumbUri, thumbFailed } = usePdfThumbnail(sourceFilePath)

    if (thumbFailed && isPdf) {
        return (
            <View style={styles.pdfHero}>
                <View style={styles.pdfIconWrap}>
                    <Feather name="file-text" size={fs(32)} color="#EEF6A2" />
                </View>
            </View>
        )
    }

    return (
        <ImageBackground
            source={{ uri: `${isPdf ? thumbUri : sourceFilePath}` }}
            style={styles.heroImage}
            imageStyle={{ opacity: 0.9, borderRadius: scale(20) }}
        >
            <LinearGradient
                colors={["transparent", "#FAFAF8"]}
                style={styles.heroGradient}
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    heroImage: {
        width: "100%",
        height: vScale(140),
        justifyContent: "flex-end",
    },
    heroGradient: {
        height: vScale(80),
    },
    pdfHero: {
        width: "100%",
        height: vScale(140),
        borderRadius: scale(20),
        backgroundColor: "#0D1F1C",
        alignItems: "center",
        justifyContent: "center",
    },
    pdfIconWrap: {
        width: scale(56),
        height: scale(56),
        borderRadius: scale(14),
        backgroundColor: "#23433880",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default DocumentHero