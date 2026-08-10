import { MedicineDetails } from '@/types';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    medicineDetails: MedicineDetails;
};

const formatDate = (iso: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const Details: React.FC<Props> = ({ medicineDetails }) => {
    const { doctor_name, date, notes, isPdf } = medicineDetails;
    const formattedDate = formatDate(date);
    const hasNotes = notes && notes.length > 0;

    if (!doctor_name && !formattedDate && !hasNotes && !isPdf) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.card}>
                {doctor_name && (
                    <View style={styles.row}>
                        <Feather name="user" size={13} color="#5F5E5A" />
                        <View style={styles.rowText}>
                            <Text style={styles.rowLabel}>Prescribing doctor</Text>
                            <Text style={styles.rowValue}>{doctor_name}</Text>
                        </View>
                    </View>
                )}

                {formattedDate && (
                    <View style={styles.row}>
                        <Feather name="calendar" size={13} color="#5F5E5A" />
                        <View style={styles.rowText}>
                            <Text style={styles.rowLabel}>Start date</Text>
                            <Text style={styles.rowValue}>{formattedDate}</Text>
                        </View>
                    </View>
                )}

                {hasNotes && (
                    <View style={styles.notesWrap}>
                        {notes.map((note, i) => (
                            <Text key={i} style={styles.noteText}>
                                "{note}"
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(16),
        gap: vScale(10),
    },
    sectionTitle: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        letterSpacing: 0.4,
        color: '#5F5E5A',
    },
    card: {
        backgroundColor: '#FAFAF8',
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: '#E5E4DD',
        padding: scale(14),
        gap: vScale(12),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(10),
    },
    rowText: {
        flex: 1,
        gap: vScale(2),
    },
    rowLabel: {
        fontSize: fs(10),
        fontFamily: 'Aeonik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        color: '#5F5E5A',
    },
    rowValue: {
        fontSize: fs(14),
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
    },
    notesWrap: {
        paddingTop: vScale(4),
        borderTopWidth: 1,
        borderTopColor: '#E5E4DD',
        gap: vScale(6),
    },
    noteText: {
        fontSize: fs(12.5),
        fontFamily: 'Aeonik-Regular',
        color: '#5F5E5A',
        fontStyle: 'italic',
        lineHeight: fs(18),
    },
    docButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        backgroundColor: '#F1EFE8',
        borderRadius: scale(12),
        paddingVertical: scale(12),
    },
    docButtonText: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Medium',
        color: '#234338',
    },
});

export default Details;