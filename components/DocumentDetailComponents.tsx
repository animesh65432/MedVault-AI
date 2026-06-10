import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medicine, Test, BillingItem, MedicalDocument } from '@/types';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Section: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    accent?: string;
    children: React.ReactNode;
}> = ({ icon, title, accent = '#EEF6A2', children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBadge, { backgroundColor: accent + '22' }]}>
                <Ionicons name={icon} size={scale(14)} color={accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
        </View>
        <View style={styles.sectionBody}>{children}</View>
    </View>
);

// ─── InfoRow ──────────────────────────────────────────────────────────────────

export const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

// ─── TagPill ──────────────────────────────────────────────────────────────────

export const TagPill: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
    <View style={[styles.tagPill, { backgroundColor: accent + '18', borderColor: accent + '33' }]}>
        <Text style={[styles.tagText, { color: accent }]}>{label}</Text>
    </View>
);

// ─── MedicineTable ────────────────────────────────────────────────────────────

export const MedicineTable: React.FC<{ medicines: Medicine[]; accent: string }> = ({ medicines, accent }) => (
    <View style={styles.table}>
        <View style={[styles.tableHeader, { borderBottomColor: accent + '33' }]}>
            {['Medicine', 'Dosage', 'Frequency', 'Duration'].map(h => (
                <Text key={h} style={[styles.tableHeaderText, { color: accent, flex: h === 'Medicine' ? 2 : 1 }]}>
                    {h}
                </Text>
            ))}
        </View>
        {medicines.map((med, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tableCellBold, { flex: 2 }]} numberOfLines={2}>{med.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{med.dosage ?? '—'}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{med.frequency ?? '—'}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{med.duration ?? '—'}</Text>
            </View>
        ))}
    </View>
);

// ─── MedicationsTable (simple id+name list) ───────────────────────────────────

export const MedicationsTable: React.FC<{ medications: { id: number; name: string }[]; accent: string }> = ({ medications, accent }) => (
    <View style={styles.table}>
        {medications.map((med, i) => (
            <View key={med.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={styles.tableCellBold}>{med.name}</Text>
            </View>
        ))}
    </View>
);

// ─── TestTable ────────────────────────────────────────────────────────────────

export const TestTable: React.FC<{ tests: Test[]; accent: string }> = ({ tests, accent }) => (
    <View style={styles.table}>
        <View style={[styles.tableHeader, { borderBottomColor: accent + '33' }]}>
            {['Test', 'Value', 'Range', 'Status'].map(h => (
                <Text key={h} style={[styles.tableHeaderText, { color: accent, flex: h === 'Test' ? 2 : 1 }]}>
                    {h}
                </Text>
            ))}
        </View>
        {tests.map((t, i) => {
            const statusColor =
                t.status?.toLowerCase() === 'normal' ? '#7DD4A8' :
                    t.status?.toLowerCase() === 'high' ? '#F5A8A8' :
                        t.status?.toLowerCase() === 'low' ? '#F5C97D' :
                            'rgba(238,246,162,0.5)';
            return (
                <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                    <Text style={[styles.tableCellBold, { flex: 2 }]} numberOfLines={2}>{t.name}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{t.value && t.unit ? `${t.value} ${t.unit}` : (t.value ?? '—')}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{t.normal_range ?? '—'}</Text>
                    <Text style={[styles.tableCell, { flex: 1, color: statusColor }]}>{t.status ?? '—'}</Text>
                </View>
            );
        })}
    </View>
);

// ─── BillingTable ─────────────────────────────────────────────────────────────

export const BillingTable: React.FC<{ items: BillingItem[]; doc: MedicalDocument; accent: string }> = ({ items, doc, accent }) => {
    const m = doc.document_metadata;
    return (
        <View style={styles.table}>
            {items.map((item, i) => (
                <View key={i} style={[styles.billingRow, i % 2 === 1 && styles.tableRowAlt]}>
                    <Text style={styles.tableCellBold}>{item.name}</Text>
                    <Text style={styles.infoValue}>{item.price ? `₹${item.price}` : '—'}</Text>
                </View>
            ))}
            {(m.subtotal || m.discount || m.total_amount) && (
                <View style={[styles.billingTotals, { borderTopColor: accent + '33' }]}>
                    {m.subtotal && <InfoRow label="Subtotal" value={`₹${m.subtotal}`} />}
                    {m.discount && <InfoRow label="Discount" value={`₹${m.discount}`} />}
                    {m.total_amount && (
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: accent }]}>Total</Text>
                            <Text style={[styles.infoValue, { color: accent, fontSize: scale(15), fontWeight: '700' }]}>
                                ₹{m.total_amount}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

// ─── DetailSkeleton ───────────────────────────────────────────────────────────

export const DetailSkeleton: React.FC = () => {
    const shimmer = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, { toValue: SCREEN_WIDTH, duration: 1400, useNativeDriver: true })
        ).start();
    }, []);

    const Block = ({ w, h, r = 6 }: { w: number | string; h: number; r?: number }) => (
        <View style={{ width: w as any, height: h, borderRadius: r, backgroundColor: '#243f38', overflow: 'hidden', marginBottom: vScale(8) }}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { width: SCREEN_WIDTH * 0.5, backgroundColor: 'rgba(238,246,162,0.06)', transform: [{ translateX: shimmer }] }]} />
        </View>
    );

    return (
        <ScrollView
            style={styles.skeletonContainer}
            contentContainerStyle={{ padding: scale(20), gap: vScale(16) }}
            scrollEnabled={false}
        >
            <Block w="70%" h={vScale(22)} r={8} />
            <Block w="45%" h={vScale(14)} />
            <Block w="100%" h={vScale(200)} r={14} />
            <Block w="60%" h={vScale(16)} r={8} />
            <Block w="100%" h={vScale(80)} r={10} />
            <Block w="55%" h={vScale(16)} r={8} />
            <Block w="100%" h={vScale(120)} r={10} />
        </ScrollView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // Section
    section: {
        backgroundColor: '#1E3A33',
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.08)',
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        paddingHorizontal: scale(14),
        paddingVertical: vScale(11),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(238,246,162,0.06)',
    },
    sectionIconBadge: {
        width: scale(24),
        height: scale(24),
        borderRadius: scale(7),
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: scale(12),
        fontFamily: 'Aeonik-Medium',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    sectionBody: {
        padding: scale(14),
        gap: vScale(4),
    },

    // InfoRow
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: vScale(5),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(238,246,162,0.05)',
    },
    infoLabel: {
        fontSize: scale(12),
        color: 'rgba(238,246,162,0.45)',
        fontFamily: 'Aeonik-Medium',
        flex: 1,
    },
    infoValue: {
        fontSize: scale(13),
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },

    // TagPill
    tagPill: {
        paddingHorizontal: scale(10),
        paddingVertical: vScale(4),
        borderRadius: scale(20),
        borderWidth: 1,
    },
    tagText: {
        fontSize: scale(12),
        fontFamily: 'Aeonik-Medium',
        fontWeight: '500',
    },

    // Tables
    table: {
        borderRadius: scale(8),
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: vScale(7),
        borderBottomWidth: 1,
        gap: scale(4),
    },
    tableHeaderText: {
        fontSize: scale(10),
        fontFamily: 'Aeonik-Medium',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: vScale(8),
        gap: scale(4),
    },
    tableRowAlt: {
        backgroundColor: 'rgba(238,246,162,0.03)',
    },
    tableCellBold: {
        fontSize: scale(12),
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        fontWeight: '600',
    },
    tableCell: {
        fontSize: scale(12),
        color: 'rgba(238,246,162,0.6)',
        fontFamily: 'Aeonik-Medium',
    },

    // Billing
    billingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: vScale(8),
    },
    billingTotals: {
        marginTop: vScale(8),
        paddingTop: vScale(8),
        borderTopWidth: 1,
        gap: vScale(4),
    },

    // Skeleton
    skeletonContainer: {
        flex: 1,
        backgroundColor: '#162E28',
    },
});