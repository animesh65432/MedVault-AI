import { OnboardingContext } from '@/context';
import { AlarmContext } from '@/context/Alarm';
import { UserNameContext } from '@/context/UserName';
import { GetRemindersCount } from '@/db/alerts';
import { GetDocumentsCount } from '@/db/document';
import { GetMedicinesCount } from '@/db/medicines';
import { CountTypes } from '@/types';
import { fs } from '@/utils/fs';
import { resetAllData } from '@/utils/resetAllData';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useContext, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import GenrateSummaryCard from './Genratesummary';
import LogoutModal from './LogOutModel';

export default function ProfileScreen() {
    const db = useSQLiteContext()
    const [visible, setVisible] = useState(false)
    const router = useRouter()
    const { setUserName, setCreated } = useContext(UserNameContext)
    const { OnChangeIsAlarmActive } = useContext(AlarmContext)
    const { setOnboardingCompleteAndCache } = useContext(OnboardingContext)
    const [counts, setCounts] = useState<CountTypes>({
        documentsCount: 0,
        medicinesCount: 0,
        remindersCount: 0,
    });

    async function fetchCounts() {
        try {
            const [documentsCount, medicinesCount, remindersCount] = await Promise.all([
                GetDocumentsCount(db),
                GetMedicinesCount(db),
                GetRemindersCount(db),
            ]);
            setCounts({
                documentsCount,
                medicinesCount,
                remindersCount,
            });

        } catch (error) {
            console.error("Failed to fetch counts:", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchCounts();
            return () => {
                fetchCounts();
            };
        }, [])
    );
    const handleConfirm = async () => {
        setVisible(false)
        await resetAllData(db)
        setUserName("")
        setCreated(null)
        OnChangeIsAlarmActive(false)
        setOnboardingCompleteAndCache(false)
    }


    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <LinearGradient
                    colors={['#0D483F', '#234338']}
                    style={styles.avatarRing}
                >
                    <View style={styles.avatarInner}>
                        <Text style={styles.avatarLetter}>K</Text>
                    </View>
                </LinearGradient>
                <Text style={styles.name}>Kiran</Text>
                <Text style={styles.memberSince}>Member since August 2026</Text>
            </View>
            <View style={styles.statsRow}>
                <TouchableOpacity
                    style={styles.statBox}
                    onPress={() => router.push("/Search")}
                >
                    <Text style={styles.statNum}>{counts.documentsCount}</Text>
                    <Text style={styles.statLabel}>Documents</Text>
                </TouchableOpacity>
                <View style={styles.statDivider} />
                <TouchableOpacity
                    style={styles.statBox}
                    onPress={() => router.push("/Medicines")}
                >
                    <Text style={styles.statNum}>{counts.medicinesCount}</Text>
                    <Text style={styles.statLabel}>Meds</Text>
                </TouchableOpacity>
                <View style={styles.statDivider} />
                <TouchableOpacity
                    style={styles.statBox}
                    onPress={() => router.push("/Alerts")}
                >
                    <Text style={styles.statNum}>{counts.remindersCount}</Text>
                    <Text style={styles.statLabel}>Reminders</Text>
                </TouchableOpacity>
            </View>

            <GenrateSummaryCard />
            <View style={styles.menuCard}>
                <MenuRow
                    icon="notifications-outline"
                    label="Notification settings"
                    OnPress={() => router.push("/Alerts")}
                />
                <MenuRow
                    icon="log-out-outline"
                    label="Log out"
                    danger
                    last
                    OnPress={() => setVisible(true)}
                />
            </View>
            {visible && <LogoutModal
                visible={visible}
                handleConfirm={handleConfirm}
                setVisible={setVisible}
            />}
        </ScrollView>
    );
}

function MenuRow({ icon, label, danger, last, OnPress }: { icon: any; label: string; danger?: boolean; last?: boolean, OnPress?: () => void }) {
    return (
        <TouchableOpacity
            style={[styles.menuRow, !last && styles.menuRowBorder]}
            activeOpacity={0.6}
            onPress={OnPress}
        >
            <Ionicons
                name={icon}
                size={20}
                color={danger ? '#C24A4A' : '#0D483F'}
                style={{ marginRight: scale(12) }}
            />
            <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
                {label}
            </Text>
            {!danger && (
                <Ionicons name="chevron-forward" size={18} color="#B8B8B8" style={{ marginLeft: 'auto' }} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F5F5F3' },
    content: { paddingBottom: vScale(120) },
    header: {
        alignItems: 'center',
        paddingTop: vScale(32),
        paddingBottom: vScale(20),
    },
    avatarRing: {
        width: scale(96),
        height: scale(96),
        borderRadius: scale(48),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vScale(14),
    },
    avatarInner: {
        width: scale(86),
        height: scale(86),
        borderRadius: scale(43),
        backgroundColor: '#EEF6A2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLetter: {
        fontFamily: 'Aeonik-Bold',
        fontSize: fs(32),
        color: '#0D483F',
    },
    name: {
        fontFamily: 'Aeonik-Bold',
        fontSize: fs(22),
        color: '#0D1F1C',
        marginBottom: vScale(2),
    },
    memberSince: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(13),
        color: '#8A8A85',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(16),
        marginHorizontal: scale(20),
        marginBottom: vScale(20),
        paddingVertical: vScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, backgroundColor: '#EDEDEA' },
    statNum: {
        fontFamily: 'Aeonik-Bold',
        fontSize: fs(18),
        color: '#0D483F',
    },
    statLabel: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(11),
        color: '#8A8A85',
        marginTop: vScale(2),
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(16),
        marginHorizontal: scale(20),
        marginTop: vScale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
        overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vScale(16),
        paddingHorizontal: scale(18),
    },
    menuRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1EE',
    },
    menuLabel: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(15),
        color: '#0D1F1C',
    },
    menuLabelDanger: {
        color: '#C24A4A',
    },
});