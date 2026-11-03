import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Image, StyleSheet, Text, View } from "react-native";

const Header: React.FC = () => {
    return (
        <View style={styles.Container}>
            <Image
                style={styles.image}
                source={require("../../../../assets/images/app-icon.png")}
                resizeMode="cover"
            />
            <View style={styles.titleAndSubtitle}>
                <Text style={styles.title}>MedVault AI</Text>
                <Text style={styles.subtitle}>Your medical assistant</Text>
            </View>
            <AntDesign
                name="history"
                size={scale(28)}
                color="#213320"
                style={styles.historyIcon}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(5),
    },
    image: {
        width: scale(50),
        height: vScale(70)
    },
    titleAndSubtitle: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(2)
    },
    title: {
        fontSize: fs(22),
        fontFamily: "Aeonik-Medium",
        color: "#213320",
    },
    subtitle: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Regular",
        color: "#213320",
    },
    historyIcon: {
        marginLeft: "auto",
    }
})

export default Header