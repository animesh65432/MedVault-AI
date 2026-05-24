import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    Image, TouchableOpacity, Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GetDocById } from '@/api/docs';
import { User } from '@/context/User';
import { MedicalDocument, DocumentType } from '@/types';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { formatDate } from '@/utils/formatDate';
import Error from '@/components/Error';
import {
    Section, InfoRow, TagPill,
    MedicineTable, MedicationsTable, TestTable, BillingTable,
    DetailSkeleton,
} from '@/components/DocumentDetailComponents';



type DocConfig = { icon: keyof typeof Ionicons.glyphMap; accent: string };

const DOC_CONFIG: Record<DocumentType, DocConfig> = {
    "Prescription": { icon: "medkit-outline", accent: "#7DD4A8" },
    "Prescription Receipt": { icon: "receipt-outline", accent: "#A8D4F5" },
    "Lab Report": { icon: "flask-outline", accent: "#F5C97D" },
    "Radiology Report": { icon: "scan-outline", accent: "#C9A8F5" },
    "Medical Bill": { icon: "card-outline", accent: "#F5A8A8" },
    "Discharge Summary": { icon: "exit-outline", accent: "#A8F5E0" },
    "Insurance Document": { icon: "shield-checkmark-outline", accent: "#A8C8F5" },
    "Medical History Record": { icon: "time-outline", accent: "#F5DDA8" },
    "Referral Letter": { icon: "mail-outline", accent: "#D4A8F5" },
    "Consent Form": { icon: "pencil-outline", accent: "#A8F5B8" },
    "Other": { icon: "document-outline", accent: "#EEF6A2" },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DocumentDetailScreen() {
    const { token } = useContext(User);
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [doc, setDoc] = useState<MedicalDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageExpanded, setImageExpanded] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fetchDocument = async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const response = await GetDocById(token, id as string) as MedicalDocument;
            setDoc(response);
            Animated.timing(fadeAnim, { toValue: 1, duration: 340, useNativeDriver: true }).start();
        } catch (error) {
            console.error('Error fetching document:', error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchDocument(); }, [id]);

    if (isLoading) return <DetailSkeleton />;
    if (hasError || !doc) return <Error fetchData={fetchDocument} />;

    const { icon, accent } = DOC_CONFIG[doc.doc_type] ?? DOC_CONFIG['Other'];
    const m = doc.document_metadata;

    const hasProvider = !!(m.doctor_name || m.clinic_name || m.hospital_name || m.lab_name || m.pharmacy_name || m.patient_name);
    const hasDates = !!(m.date || m.admission_date || m.discharge_date);
    const hasClinical = !!(m.diagnosis || m.findings || m.impression || m.procedure || m.modality || m.body_part);
    const hasInsurance = !!(m.insurance_provider || m.policy_number || m.claim_amount);
    const hasReferral = !!(m.referred_by || m.referring_doctor || m.referred_to);
    const hasHealthFlags = !!(m.allergies?.length || m.chronic_conditions?.length);
    const hasFollowUp = !!(m.follow_up || m.consent_given);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

            {/* ── Top bar ── */}
            <View style={[styles.topBar, { paddingTop: insets.top + vScale(8) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={scale(20)} color="#EEF6A2" />
                </TouchableOpacity>
                <View style={[styles.docTypeBadge, { backgroundColor: accent + '22' }]}>
                    <Ionicons name={icon} size={scale(13)} color={accent} />
                    <Text style={[styles.docTypeText, { color: accent }]}>{doc.doc_type}</Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Title ── */}
                <View style={[styles.titleBlock, { borderLeftColor: accent }]}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    {formatDate(doc.date || doc.created_at) && (
                        <Text style={styles.docDate}>{formatDate(doc.date || doc.created_at)}</Text>
                    )}
                </View>

                {/* ── Image ── */}
                {doc.source_link ? (
                    <TouchableOpacity
                        activeOpacity={0.92}
                        onPress={() => setImageExpanded(e => !e)}
                        style={styles.imageWrapper}
                    >
                        <Image
                            source={{ uri: doc.source_link }}
                            style={[styles.docImage, imageExpanded && styles.docImageExpanded]}
                            resizeMode={imageExpanded ? 'contain' : 'cover'}
                        />
                        <View style={styles.imageOverlay}>
                            <Ionicons
                                name={imageExpanded ? 'contract-outline' : 'expand-outline'}
                                size={scale(16)}
                                color="#EEF6A2"
                            />
                        </View>
                    </TouchableOpacity>
                ) : null}

                {/* ── Provider ── */}
                {hasProvider && (
                    <Section icon="person-outline" title="Provider" accent={accent}>
                        {m.doctor_name && <InfoRow label="Doctor" value={`Dr. ${m.doctor_name}`} />}
                        {m.clinic_name && <InfoRow label="Clinic" value={m.clinic_name} />}
                        {m.hospital_name && <InfoRow label="Hospital" value={m.hospital_name} />}
                        {m.lab_name && <InfoRow label="Lab" value={m.lab_name} />}
                        {m.pharmacy_name && <InfoRow label="Pharmacy" value={m.pharmacy_name} />}
                        {m.patient_name && <InfoRow label="Patient" value={m.patient_name} />}
                    </Section>
                )}

                {/* ── Dates ── */}
                {hasDates && (
                    <Section icon="calendar-outline" title="Dates" accent={accent}>
                        {m.date && <InfoRow label="Date" value={formatDate(m.date) ?? m.date} />}
                        {m.admission_date && <InfoRow label="Admitted" value={formatDate(m.admission_date) ?? m.admission_date} />}
                        {m.discharge_date && <InfoRow label="Discharged" value={formatDate(m.discharge_date) ?? m.discharge_date} />}
                    </Section>
                )}

                {/* ── Clinical ── */}
                {hasClinical && (
                    <Section icon="pulse-outline" title="Clinical" accent={accent}>
                        {m.diagnosis && <InfoRow label="Diagnosis" value={m.diagnosis} />}
                        {m.body_part && <InfoRow label="Body Part" value={m.body_part} />}
                        {m.modality && <InfoRow label="Modality" value={m.modality} />}
                        {m.procedure && <InfoRow label="Procedure" value={m.procedure} />}
                        {m.findings && (
                            <View style={styles.textBlock}>
                                <Text style={styles.textBlockLabel}>Findings</Text>
                                <Text style={styles.textBlockContent}>{m.findings}</Text>
                            </View>
                        )}
                        {m.impression && (
                            <View style={styles.textBlock}>
                                <Text style={styles.textBlockLabel}>Impression</Text>
                                <Text style={styles.textBlockContent}>{m.impression}</Text>
                            </View>
                        )}
                    </Section>
                )}

                {/* ── Medications (simple list) ── */}
                {doc.medications?.length > 0 && (
                    <Section icon="medkit-outline" title="Medications" accent={accent}>
                        <MedicationsTable medications={doc.medications} accent={accent} />
                    </Section>
                )}

                {/* ── Medicines (detailed metadata) ── */}
                {m.medicines?.length > 0 && (
                    <Section icon="medkit-outline" title="Medicines" accent={accent}>
                        <MedicineTable medicines={m.medicines} accent={accent} />
                    </Section>
                )}

                {m.current_medicines?.length > 0 && (
                    <Section icon="medkit-outline" title="Current Medicines" accent={accent}>
                        <MedicineTable medicines={m.current_medicines} accent={accent} />
                    </Section>
                )}

                {/* ── Tests ── */}
                {m.tests?.length > 0 && (
                    <Section icon="flask-outline" title="Test Results" accent={accent}>
                        <TestTable tests={m.tests} accent={accent} />
                    </Section>
                )}

                {m.past_tests?.length > 0 && (
                    <Section icon="flask-outline" title="Past Tests" accent={accent}>
                        <TestTable tests={m.past_tests} accent={accent} />
                    </Section>
                )}

                {/* ── Billing ── */}
                {m.billing_items?.length > 0 && (
                    <Section icon="card-outline" title="Billing" accent={accent}>
                        <BillingTable items={m.billing_items} doc={doc} accent={accent} />
                    </Section>
                )}

                {/* ── Insurance ── */}
                {hasInsurance && (
                    <Section icon="shield-checkmark-outline" title="Insurance" accent={accent}>
                        {m.insurance_provider && <InfoRow label="Provider" value={m.insurance_provider} />}
                        {m.policy_number && <InfoRow label="Policy No." value={m.policy_number} />}
                        {m.claim_amount && <InfoRow label="Claim Amount" value={`₹${m.claim_amount}`} />}
                    </Section>
                )}

                {/* ── Referral ── */}
                {hasReferral && (
                    <Section icon="mail-outline" title="Referral" accent={accent}>
                        {m.referred_by && <InfoRow label="Referred By" value={m.referred_by} />}
                        {m.referring_doctor && <InfoRow label="Referring Dr." value={`Dr. ${m.referring_doctor}`} />}
                        {m.referred_to && <InfoRow label="Referred To" value={m.referred_to} />}
                    </Section>
                )}

                {/* ── Health flags ── */}
                {hasHealthFlags && (
                    <Section icon="warning-outline" title="Health Flags" accent="#F5A8A8">
                        {m.allergies?.length > 0 && (
                            <View>
                                <Text style={styles.textBlockLabel}>Allergies</Text>
                                <View style={styles.pillsWrap}>
                                    {m.allergies.map((a, i) => <TagPill key={i} label={a} accent="#F5A8A8" />)}
                                </View>
                            </View>
                        )}
                        {m.chronic_conditions?.length > 0 && (
                            <View style={{ marginTop: vScale(10) }}>
                                <Text style={styles.textBlockLabel}>Chronic Conditions</Text>
                                <View style={styles.pillsWrap}>
                                    {m.chronic_conditions.map((c, i) => <TagPill key={i} label={c} accent="#F5DDA8" />)}
                                </View>
                            </View>
                        )}
                    </Section>
                )}

                {/* ── Follow-up & Consent ── */}
                {hasFollowUp && (
                    <Section icon="alarm-outline" title="Follow-up & Consent" accent={accent}>
                        {m.follow_up && <InfoRow label="Follow-up" value={m.follow_up} />}
                        {m.consent_given && <InfoRow label="Consent Given" value={m.consent_given} />}
                    </Section>
                )}

                {/* ── Important notes ── */}
                {m.important_notes?.length > 0 && (
                    <Section icon="alert-circle-outline" title="Important Notes" accent="#F5C97D">
                        {m.important_notes.map((note, i) => (
                            <View key={i} style={styles.noteRow}>
                                <View style={styles.noteDot} />
                                <Text style={styles.noteText}>{note}</Text>
                            </View>
                        ))}
                    </Section>
                )}

                {/* ── Tags ── */}
                {m.tags?.length > 0 && (
                    <Section icon="pricetag-outline" title="Tags" accent={accent}>
                        <View style={styles.pillsWrap}>
                            {m.tags.map((tag, i) => <TagPill key={i} label={tag} accent={accent} />)}
                        </View>
                    </Section>
                )}

                <View style={{ height: insets.bottom + vScale(24) }} />
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#162E28',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingBottom: vScale(12),
    },
    backButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(10),
        backgroundColor: '#1E3A33',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.1)',
    },
    docTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        paddingHorizontal: scale(12),
        paddingVertical: vScale(6),
        borderRadius: scale(20),
    },
    docTypeText: {
        fontSize: scale(12),
        fontFamily: 'Aeonik-Medium',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    scrollContent: {
        paddingHorizontal: scale(16),
        gap: vScale(12),
    },
    titleBlock: {
        borderLeftWidth: 3,
        paddingLeft: scale(12),
        gap: vScale(4),
    },
    docTitle: {
        fontSize: scale(20),
        fontWeight: '700',
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        letterSpacing: -0.3,
    },
    docDate: {
        fontSize: scale(13),
        color: 'rgba(238,246,162,0.45)',
        fontFamily: 'Aeonik-Medium',
    },
    imageWrapper: {
        borderRadius: scale(14),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.1)',
    },
    docImage: {
        width: '100%',
        height: vScale(200),
    },
    docImageExpanded: {
        height: vScale(420),
    },
    imageOverlay: {
        position: 'absolute',
        bottom: scale(10),
        right: scale(10),
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: scale(8),
        padding: scale(6),
    },
    textBlock: {
        gap: vScale(4),
        paddingVertical: vScale(5),
    },
    textBlockLabel: {
        fontSize: scale(12),
        color: 'rgba(238,246,162,0.45)',
        fontFamily: 'Aeonik-Medium',
    },
    textBlockContent: {
        fontSize: scale(13),
        color: 'rgba(238,246,162,0.75)',
        fontFamily: 'Aeonik-Medium',
        lineHeight: scale(20),
    },
    pillsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(8),
        marginTop: vScale(6),
    },
    noteRow: {
        flexDirection: 'row',
        gap: scale(10),
        alignItems: 'flex-start',
        paddingVertical: vScale(4),
    },
    noteDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: '#F5C97D',
        marginTop: vScale(6),
    },
    noteText: {
        flex: 1,
        fontSize: scale(13),
        color: 'rgba(238,246,162,0.75)',
        fontFamily: 'Aeonik-Medium',
        lineHeight: scale(20),
    },
});