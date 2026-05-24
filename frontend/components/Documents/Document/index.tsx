import React, { useRef } from 'react'
import { View, Text, StyleSheet, Animated, Pressable } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { MedicalDocument, DocumentType } from "@/types"
import { useRouter } from "expo-router"
import { scale } from '@/utils/scale';
import { formatDate } from '@/utils/formatDate';
import { vScale } from '@/utils/vScale';


type DocConfig = {
    icon: keyof typeof Ionicons.glyphMap;
    accent: string;
    label: string;
};

const DOC_CONFIG: Record<DocumentType, DocConfig> = {
    "Prescription": { icon: "medkit-outline", accent: "#7DD4A8", label: "Prescription" },
    "Prescription Receipt": { icon: "receipt-outline", accent: "#A8D4F5", label: "Rx Receipt" },
    "Lab Report": { icon: "flask-outline", accent: "#F5C97D", label: "Lab Report" },
    "Radiology Report": { icon: "scan-outline", accent: "#C9A8F5", label: "Radiology" },
    "Medical Bill": { icon: "card-outline", accent: "#F5A8A8", label: "Bill" },
    "Discharge Summary": { icon: "exit-outline", accent: "#A8F5E0", label: "Discharge" },
    "Insurance Document": { icon: "shield-checkmark-outline", accent: "#A8C8F5", label: "Insurance" },
    "Medical History Record": { icon: "time-outline", accent: "#F5DDA8", label: "History" },
    "Referral Letter": { icon: "mail-outline", accent: "#D4A8F5", label: "Referral" },
    "Consent Form": { icon: "pencil-outline", accent: "#A8F5B8", label: "Consent" },
    "Other": { icon: "document-outline", accent: "#EEF6A2", label: "Document" },
};


const getSubtitle = (doc: MedicalDocument): string | null => {
    const m = doc.document_metadata;
    if (m.doctor_name) return `Dr. ${m.doctor_name}`;
    if (m.clinic_name) return m.clinic_name;
    if (m.hospital_name) return m.hospital_name;
    if (m.lab_name) return m.lab_name;
    if (m.pharmacy_name) return m.pharmacy_name;
    if (m.patient_name) return m.patient_name;
    return null;
};

const getPills = (doc: MedicalDocument): string[] => {
    const m = doc.document_metadata;
    const pills: string[] = [];

    if (m.medicines?.length)
        pills.push(`${m.medicines.length} Medicine${m.medicines.length > 1 ? "s" : ""}`);
    if (m.tests?.length)
        pills.push(`${m.tests.length} Test${m.tests.length > 1 ? "s" : ""}`);
    if (m.diagnosis)
        pills.push(m.diagnosis.length > 22 ? m.diagnosis.slice(0, 22) + "…" : m.diagnosis);
    if (m.total_amount)
        pills.push(`₹${m.total_amount}`);
    if (m.follow_up)
        pills.push("Follow-up");

    return pills.slice(0, 3);
};


interface DocumentProps {
    document: MedicalDocument;
    onPress?: (doc: MedicalDocument) => void;
    IsSearch?: boolean;
}

const Document: React.FC<DocumentProps> = ({ document, onPress, IsSearch = false }) => {
    const config = DOC_CONFIG[document.doc_type] ?? DOC_CONFIG["Other"];
    const subtitle = getSubtitle(document);
    const pills = getPills(document);
    const router = useRouter();
    const date = formatDate(document.date || document.created_at);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.975,
            damping: 14,
            stiffness: 200,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            damping: 12,
            stiffness: 160,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={() => router.push(`/document/${document.id}`)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.card}
            >

                <View style={[styles.stripe, { backgroundColor: config.accent }]} />


                <View style={[styles.iconBadge, { backgroundColor: config.accent + "22" }]}>
                    <Ionicons
                        name={config.icon}
                        size={scale(20)}
                        color={config.accent}
                    />
                </View>

                {/* Body */}
                <View style={styles.body}>
                    {/* Top row: type badge + date */}
                    <View style={styles.topRow}>
                        <View style={[styles.typeBadge, { backgroundColor: config.accent + "1A" }]}>
                            <Text style={[styles.typeText, { color: config.accent }]}>
                                {config.label}
                            </Text>
                        </View>
                        {date && (
                            <Text style={styles.dateText}>{date}</Text>
                        )}
                    </View>

                    <Text
                        style={styles.title}
                        numberOfLines={IsSearch ? 4 : 1}
                    >
                        {document.title}
                    </Text>


                    {subtitle && (
                        <Text style={styles.subtitle} numberOfLines={IsSearch ? 4 : 1}>
                            {subtitle}
                        </Text>
                    )}


                    {pills.length > 0 && (
                        <View style={styles.pillRow}>
                            {pills.map((pill, i) => (
                                <View key={i} style={styles.pill}>
                                    <Text style={styles.pillText}>{pill}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>


                <Ionicons
                    name="chevron-forward"
                    size={scale(16)}
                    color="rgba(238, 246, 162, 0.25)"
                    style={styles.chevron}
                />
            </Pressable>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E3A33",
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: "rgba(238, 246, 162, 0.08)",
        paddingVertical: vScale(14),
        paddingRight: scale(12),
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: vScale(3) },
        shadowOpacity: 0.15,
        shadowRadius: vScale(8),
        elevation: 3,
    },
    stripe: {
        width: scale(3),
        alignSelf: "stretch",
        borderTopRightRadius: scale(3),
        borderBottomRightRadius: scale(3),
        marginRight: scale(12),
    },
    iconBadge: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(12),
        alignItems: "center",
        justifyContent: "center",
        marginRight: scale(12),
    },
    body: {
        flex: 1,
        gap: vScale(4),
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: vScale(1),
    },
    typeBadge: {
        paddingHorizontal: scale(8),
        paddingVertical: vScale(2),
        borderRadius: scale(6),
    },
    typeText: {
        fontSize: scale(10),
        fontFamily: "Aeonik-Medium",
        fontWeight: "600",
        letterSpacing: 0.4,
        textTransform: "uppercase",
    },
    dateText: {
        fontSize: scale(11),
        color: "rgba(238, 246, 162, 0.4)",
        fontFamily: "Aeonik-Medium",
    },
    title: {
        fontSize: scale(14),
        fontWeight: "600",
        color: "#EEF6A2",
        fontFamily: "Aeonik-Medium",
        letterSpacing: 0.1,
    },
    subtitle: {
        fontSize: scale(12),
        color: "rgba(238, 246, 162, 0.5)",
        fontFamily: "Aeonik-Medium",
    },
    pillRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(6),
        marginTop: vScale(4),
    },
    pill: {
        backgroundColor: "rgba(238, 246, 162, 0.08)",
        borderRadius: scale(6),
        paddingHorizontal: scale(8),
        paddingVertical: vScale(3),
    },
    pillText: {
        fontSize: scale(11),
        color: "rgba(238, 246, 162, 0.6)",
        fontFamily: "Aeonik-Medium",
    },
    chevron: {
        marginLeft: scale(8),
    }
});

export default Document;