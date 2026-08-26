import { GetPatientSummary } from '@/db/patient_summary';
import { useGenratePdf } from "@/hooks/use-GenratePdf";
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function GenrateSummaryCard() {
    const db = useSQLiteContext();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleGenerateSummary = async () => {
        if (loading) return;
        setLoading(true);
        setProgress(0);
        try {
            const PatientSummary = await GetPatientSummary(db)
            setProgress(50);
            const response = await useGenratePdf(PatientSummary);
            setProgress(100);
            console.log('PDF generated at:', response);
        } catch (error) {
            console.error('Error generating patient summary:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 400); // brief pause so the 100% state is visible before resetting
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.iconCircle}>
                <Ionicons name="document-text-outline" size={24} color="#0D483F" />
            </View>

            <Text style={styles.cardTitle}>Patient Summary</Text>
            <Text style={styles.cardSubtitle}>
                Generate a complete PDF summary of your medical records for doctor
                visits.
            </Text>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleGenerateSummary}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <>
                        <ActivityIndicator size="small" color="#FAFAF8" />
                        <Text style={styles.buttonText}>Generating...</Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="download-outline" size={18} color="#FAFAF8" />
                        <Text style={styles.buttonText}>Generate Summary PDF</Text>
                    </>
                )}
            </TouchableOpacity>

            {loading && (
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(16),
        padding: scale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        width: '90%',
        alignSelf: 'center',
    },
    iconCircle: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        backgroundColor: '#D9F99D',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vScale(12),
    },
    cardTitle: {
        fontFamily: 'Aeonik-Bold',
        fontSize: fs(18),
        color: '#0D1F1C',
        marginBottom: vScale(4),
    },
    cardSubtitle: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(14),
        color: '#666666',
        marginBottom: vScale(16),
        lineHeight: fs(20),
    },
    button: {
        backgroundColor: '#0D483F',
        borderRadius: scale(12),
        paddingVertical: vScale(14),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(15),
        color: '#FAFAF8',
    },
    progressTrack: {
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        marginTop: vScale(10),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0D483F',
        borderRadius: 2,
    },
});