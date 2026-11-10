import { scale } from '@/utils/scale';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

const Question: React.FC<Props> = ({ title, subtitle, icon }) => {
    return (
        <View style={styles.Container}>
            {icon}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "white",
        padding: scale(20),
        borderRadius: scale(24),
        display: "flex",
        flexDirection: "column",
        gap: scale(5),
    },
    title: {
        fontSize: scale(18),
        fontFamily: "Aeonik-Bold",
        color: "black"
    },
    subtitle: {
        fontSize: scale(14),
        fontFamily: "Aeonik-Regular",
        color: "#202121"
    }
})

export default Question