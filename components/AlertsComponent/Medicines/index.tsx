import { GetAllMedicines } from '@/db/alerts';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MedicineRow, { Medicine } from './Medicine';

type Props = {
    onBack: () => void;
    onConfirm: (medicine: Medicine) => void;
};

const PAGE_SIZE = 10;

const Medicines: React.FC<Props> = ({ onBack, onConfirm }) => {
    const db = useSQLiteContext();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    async function fetchPage(pageToLoad: number, isInitial: boolean) {
        try {
            if (isInitial) setLoading(true);
            else setLoadingMore(true);

            const data = await GetAllMedicines(db, pageToLoad, PAGE_SIZE);
            setMedicines(prev => (isInitial ? data : [...prev, ...data]));
            setHasMore(data.length === PAGE_SIZE);
            setPage(pageToLoad);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        fetchPage(1, true);
    }, []);

    const handleLoadMore = useCallback(() => {
        if (loadingMore || loading || !hasMore) return;
        if (query.trim()) return;
        fetchPage(page + 1, false);
    }, [loadingMore, loading, hasMore, page, query]);

    const filtered = useMemo(() => {
        if (!query.trim()) return medicines;
        return medicines.filter((m) =>
            m.name.toLowerCase().includes(query.trim().toLowerCase())
        );
    }, [medicines, query]);

    const selectedMedicine = medicines.find((m) => m.Id === selectedId) ?? null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} hitSlop={12} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={20} color="#234338" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Medicine</Text>
                <View style={{ width: scale(32) }} />
            </View>

            <View style={styles.searchWrap}>
                <Ionicons name="search" size={16} color="#8A968F" />
                <TextInput
                    style={styles.search}
                    placeholder="Search medicines..."
                    placeholderTextColor="#8A968F"
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: vScale(32) }} color="#234338" />
            ) : filtered.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Ionicons name="medkit-outline" size={28} color="#B7C4BE" />
                    <Text style={styles.emptyText}>No medicines found</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.Id.toString()}
                    renderItem={({ item }) => (
                        <MedicineRow
                            medicine={item}
                            selected={item.Id === selectedId}
                            onPress={setSelectedId}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: vScale(90) }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator style={{ marginVertical: vScale(16) }} color="#234338" />
                        ) : null
                    }
                />
            )}

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.confirmBtn, !selectedMedicine && styles.confirmBtnDisabled]}
                    disabled={!selectedMedicine}
                    onPress={() => selectedMedicine && onConfirm(selectedMedicine)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.confirmText}>
                        {selectedMedicine ? `Next · ${selectedMedicine.name}` : 'Select a medicine'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(16)
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: vScale(10),
    },
    backBtn: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#FAFAF8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(18),
        color: '#0D1F1C',
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        backgroundColor: '#FAFAF8',
        borderRadius: scale(12),
        paddingHorizontal: scale(14),
        paddingVertical: vScale(15),
        marginBottom: vScale(12),
    },
    search: {
        flex: 1,
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(13.5),
        color: '#0D1F1C',
        padding: 0,
    },
    emptyWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vScale(48),
        gap: vScale(8),
    },
    emptyText: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(13),
        color: '#8A968F',
    },
    footer: {
        position: 'absolute',
        bottom: vScale(40),
        left: scale(16),
        right: scale(16),
    },
    confirmBtn: {
        backgroundColor: '#234338',
        borderRadius: scale(14),
        paddingVertical: vScale(15),
        alignItems: 'center',
        shadowColor: '#234338',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmBtnDisabled: {
        backgroundColor: '#B7C4BE',
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(14.5),
        color: '#FAFAF8',
    },
});

export default Medicines;