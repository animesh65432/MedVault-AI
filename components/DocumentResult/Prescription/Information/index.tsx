import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";

type Props = {
    patient_name?: string;
    clinic_name?: string;
    doctor_name?: string;
    date?: string
}

const Information: React.FC<Props> = ({ date, patient_name, clinic_name, doctor_name }) => {
    const rows = [
        { icon: 'calendar-alt', value: date },
        { icon: 'user', value: patient_name },
        { icon: 'user-md', value: doctor_name },
        { icon: 'clinic-medical', value: clinic_name },
    ].filter((row) => row.value && row.value.trim().length > 0);

    if (rows.length === 0) return null;

    return (
        <View style={styles.description}>
            {rows.map((row) => (
                <View key={row.icon} style={styles.row}>
                    <FontAwesome5 name={row.icon as any} size={scale(20)} color="#234338" />
                    <Text style={styles.text}>{row.value}</Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    description: {
        gap: scale(8),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    text: {
        fontSize: fs(16),
        fontFamily: 'Aeonik-Medium',
        textTransform: 'capitalize',
    },
})

export default Information