import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type Medicine = {
    Id: number;
    name: string;
    dosage: string;
    frequency: string;
};

type Props = {
    medicine: Medicine;
    selected: boolean;
    onPress: (id: number) => void;
};

const Medicine: React.FC<Props> = ({ medicine, selected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, selected && styles.selected]}
            activeOpacity={0.7}
            onPress={() => onPress(medicine.Id)}
        >
            <View style={styles.textWrap}>
                <MaterialCommunityIcons
                    name="pill"
                    size={scale(20)}
                    color="#OD483F"
                    style={{ marginBottom: vScale(4) }}
                />
                <Text style={[styles.name, selected && styles.nameSelected]}>
                    {medicine.name}
                </Text>
                {!!medicine.dosage && (
                    <Text style={styles.subtext}>
                        {medicine.dosage}{medicine.frequency ? ` · ${medicine.frequency}` : ''}
                    </Text>
                )}
            </View>
            {selected ? (
                <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color="#FAFAF8" />
                </View>
            ) : (
                <View style={styles.emptyCircle} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vScale(13),
        paddingHorizontal: scale(16),
        borderRadius: scale(14),
        backgroundColor: '#FAFAF8',
        marginBottom: vScale(6),
        shadowColor: '#0D1F1C',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    selected: {
        backgroundColor: '#EEF6A2',
        shadowOpacity: 0,
        elevation: 0,
    },
    textWrap: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
    },
    name: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(14.5),
        color: '#4A5A54',
    },
    nameSelected: {
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
    },
    subtext: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(11.5),
        color: '#8A968F',
        marginTop: vScale(2),
    },
    checkCircle: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: '#234338',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCircle: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        borderWidth: 1.5,
        borderColor: '#DCE3DF',
    },
});

export default Medicine;