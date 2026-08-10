import { MedicineDetails } from '@/types';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    medicineDetails: MedicineDetails
}

const Hero: React.FC<Props> = ({ medicineDetails }) => {
    return (
        <View style={styles.container}>
            <View style={styles.IconWrapper}>
                <MaterialCommunityIcons
                    name="pill"
                    size={scale(35)}
                    color="#0D483F"
                />
            </View>
            <Text style={styles.tilte}>{medicineDetails.name}</Text>
            {medicineDetails.frequency !== "as_needed" ?
                <View style={styles.frequencyContainer}>
                    <Text style={styles.frequency}>{medicineDetails.frequency}</Text>
                </View>
                : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: scale(10)
    },
    tilte: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Medium",
        color: "#0D483F"
    },
    frequency: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#0D483F"
    },
    IconWrapper: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    frequencyContainer: {
        display: "flex",
        flexDirection: "row",
        gap: scale(5),
        backgroundColor: "#D9F99D",
        padding: scale(5),
        color: "white",
        borderRadius: scale(10),
        paddingHorizontal: scale(10)
    }
})

export default Hero