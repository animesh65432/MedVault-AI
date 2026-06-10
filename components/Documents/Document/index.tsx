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
    subtitleIcon: keyof typeof Ionicons.glyphMap;
};

const DOC_CONFIG: Record<DocumentType, DocConfig> = {
    "Prescription": { icon: "pencil-outline", accent: "#7DD4A8", label: "Prescription", subtitleIcon: "person-outline" },
    "Prescription Receipt": { icon: "receipt-outline", accent: "#A8D4F5", label: "Rx Receipt", subtitleIcon: "person-outline" },
    "Lab Report": { icon: "flask-outline", accent: "#F5C97D", label: "Lab Report", subtitleIcon: "analytics-outline" },
    "Radiology Report": { icon: "scan-outline", accent: "#C9A8F5", label: "Radiology", subtitleIcon: "person-outline" },
    "Medical Bill": { icon: "card-outline", accent: "#F5A8A8", label: "Bill", subtitleIcon: "business-outline" },
    "Discharge Summary": { icon: "exit-outline", accent: "#A8F5E0", label: "Discharge", subtitleIcon: "person-outline" },
    "Insurance Document": { icon: "shield-checkmark-outline", accent: "#A8C8F5", label: "Insurance", subtitleIcon: "business-outline" },
    "Medical History Record": { icon: "time-outline", accent: "#F5DDA8", label: "History", subtitleIcon: "person-outline" },
    "Referral Letter": { icon: "mail-outline", accent: "#D4A8F5", label: "Referral", subtitleIcon: "person-outline" },
    "Consent Form": { icon: "pencil-outline", accent: "#A8F5B8", label: "Consent", subtitleIcon: "person-outline" },
    "Other": { icon: "document-outline", accent: "#EEF6A2", label: "Document", subtitleIcon: "document-outline" },
};

interface DocumentProps {
    document: MedicalDocument;
    onPress?: (doc: MedicalDocument) => void;
}

const Document: React.FC<DocumentProps> = ({ document, onPress }) => {
    const config = DOC_CONFIG[document.doc_type] ?? DOC_CONFIG["Other"];
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

    const handlePress = () => {
        onPress ? onPress(document) : router.push(`/document/${document.id}`);
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.card}
            >

                <View style={[styles.iconWrap, { backgroundColor: config.accent + "33" }]}>
                    <Ionicons name={config.icon} size={scale(20)} color={config.accent.replace("33", "")} />
                </View>

                <View style={styles.content}>
                    {/* Top row: doc type + date */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{document.doc_type}</Text>
                        <Text style={styles.date}>{date}</Text>
                    </View>

                    <View style={styles.subtitleRow}>
                        <Ionicons name={config.subtitleIcon} size={scale(12)} color="#7A9E96" />
                        <Text style={styles.subtitle} numberOfLines={2}>{document.title}</Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: scale(14),
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: vScale(2) },
        shadowOpacity: 0.08,
        shadowRadius: vScale(6),
        elevation: 2,
        marginBottom: vScale(10),
    },
    accentBar: {
        width: scale(4),
        alignSelf: "stretch",
    },
    iconWrap: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(10),
        justifyContent: "center",
        alignItems: "center",
        marginLeft: scale(12),
    },
    content: {
        flex: 1,
        paddingVertical: vScale(14),
        paddingHorizontal: scale(12),
        gap: vScale(4),
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: scale(15),
        fontFamily: "Aeonik-Medium",
        color: "#1A3530",
    },
    date: {
        fontSize: scale(11),
        fontFamily: "Aeonik-Regular",
        color: "#7A9E96",
    },
    subtitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
    },
    subtitle: {
        fontSize: scale(13),
        fontFamily: "Aeonik-Regular",
        color: "#7A9E96",
        flexShrink: 1,
    },
});

export default Document;