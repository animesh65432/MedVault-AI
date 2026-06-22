import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import { User } from '@/context/User'
import Error from '@/components/Error'
import { BackButton, EmptyState, ScreenHeader } from '@/components/ui/component'
import { MedicineRecord } from '@/types'
import { token } from "@/utils/token"

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const FREQ_CONFIG: Record<string, { color: string; label: string }> = {
    'OD': { color: '#7DD4A8', label: 'Once daily' },
    'OTD': { color: '#7DD4A8', label: 'Once daily' },
    'BD': { color: '#A8D4F5', label: 'Twice daily' },
    'TDS': { color: '#F5C97D', label: 'Thrice daily' },
    'QID': { color: '#F5A8A8', label: '4x daily' },
    'SOS': { color: '#D4A8F5', label: 'As needed' },
}

const getFreqConfig = (freq: string) => {
    const key = freq?.trim().toUpperCase()
    return FREQ_CONFIG[key] ?? { color: '#EEF6A2', label: freq || '—' }
}

const MedicinesSkeleton: React.FC = () => {
    const shimmer = useRef(new Animated.Value(-SCREEN_WIDTH)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, { toValue: SCREEN_WIDTH, duration: 1400, useNativeDriver: true })
        ).start()
    }, [])

    const Block = ({ w, h, r = 6 }: { w: number | string; h: number; r?: number }) => (
        <View style={{ width: w as any, height: h, borderRadius: r, backgroundColor: '#243f38', overflow: 'hidden', marginBottom: vScale(6) }}>
            <Animated.View style={[StyleSheet.absoluteFillObject, {
                width: SCREEN_WIDTH * 0.5,
                backgroundColor: 'rgba(238,246,162,0.06)',
                transform: [{ translateX: shimmer }],
            }]} />
        </View>
    )

    return (
        <View style={{ gap: vScale(10) }}>
            {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={styles.card}>
                    <View style={[styles.cardStripe, { backgroundColor: '#243f38' }]} />
                    <View style={[styles.iconBadge, { backgroundColor: '#243f38' }]} />
                    <View style={{ flex: 1, gap: vScale(6) }}>
                        <Block w="65%" h={vScale(13)} r={6} />
                        <Block w="40%" h={vScale(10)} r={5} />
                        <View style={{ flexDirection: 'row', gap: scale(6), marginTop: vScale(2) }}>
                            <Block w={scale(64)} h={vScale(22)} r={20} />
                            <Block w={scale(52)} h={vScale(22)} r={20} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

const MedicineCard: React.FC<{ item: MedicineRecord; index: number }> = ({ item, index }) => {
    const { color, label } = getFreqConfig(item.frequency)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(vScale(16))).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 360, delay: index * 50, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, delay: index * 50, damping: 18, stiffness: 140, useNativeDriver: true }),
        ]).start()
    }, [])

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.card}>
                <View style={[styles.cardStripe, { backgroundColor: color }]} />
                <View style={[styles.iconBadge, { backgroundColor: color + '22' }]}>
                    <Ionicons name="medical-outline" size={scale(18)} color={color} />
                </View>
                <View style={styles.cardBody}>
                    <Text style={styles.medicineName} numberOfLines={2}>{item.name}</Text>

                    {/* Meta row */}
                    {(item.dosage || item.duration || item.timing) ? (
                        <View style={styles.metaRow}>
                            {!!item.dosage && (
                                <View style={styles.metaItem}>
                                    <Ionicons name="eyedrop-outline" size={scale(11)} color="rgba(238,246,162,0.4)" />
                                    <Text style={styles.metaText}>{item.dosage} tab{Number(item.dosage) > 1 ? 's' : ''}</Text>
                                </View>
                            )}
                            {!!item.duration && (
                                <View style={styles.metaItem}>
                                    <Ionicons name="time-outline" size={scale(11)} color="rgba(238,246,162,0.4)" />
                                    <Text style={styles.metaText}>{item.duration}</Text>
                                </View>
                            )}
                            {!!item.timing && (
                                <View style={styles.metaItem}>
                                    <Ionicons name="restaurant-outline" size={scale(11)} color="rgba(238,246,162,0.4)" />
                                    <Text style={styles.metaText}>{item.timing}</Text>
                                </View>
                            )}
                        </View>
                    ) : null}

                    {/* Frequency pills */}
                    {!!item.frequency && (
                        <View style={styles.pillsRow}>
                            <View style={[styles.freqPill, { backgroundColor: color + '1A', borderColor: color + '44' }]}>
                                <Text style={[styles.freqPillText, { color }]}>{item.frequency.toUpperCase()}</Text>
                            </View>
                            <View style={styles.freqLabelPill}>
                                <Text style={styles.freqLabelText}>{label}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    )
}



const Medicines = () => {
    // const { token } = useContext(User)
    const insets = useSafeAreaInsets()

    const [medicineList, setMedicineList] = useState<MedicineRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const fetchMedicineList = useCallback(async () => {
        setIsLoading(true)
        setHasError(false)
        try {
        } catch (error) {
            console.error('Error fetching medicine list:', error)
            setHasError(true)
        } finally {
            setIsLoading(false)
        }
    }, [token])

    useEffect(() => { fetchMedicineList() }, [fetchMedicineList])

    if (hasError) return <Error fetchData={fetchMedicineList} />

    return (
        <View style={[styles.container, { paddingTop: insets.top + vScale(24) }]}>
            <BackButton />
            <ScreenHeader
                title="Medicines"
                subtitle={!isLoading && medicineList.length > 0
                    ? `${medicineList.length} medicine${medicineList.length !== 1 ? 's' : ''} tracked`
                    : undefined}
                icon="medkit-outline"
            />

            {isLoading ? (
                <MedicinesSkeleton />
            ) : medicineList.length === 0 ? (
                <EmptyState
                    icon="medkit-outline"
                    title="No medicines yet"
                    subtitle="Upload a prescription to automatically extract your medicine list"
                />
            ) : (
                <FlatList
                    data={medicineList}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item, index }) => <MedicineCard item={item} index={index} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: vScale(10) }} />}
                />
            )}
        </View>
    )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingBottom: vScale(32),
        backgroundColor: '#162E28',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3A33',
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: 'rgba(238,246,162,0.08)',
        paddingVertical: vScale(14),
        paddingRight: scale(14),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: vScale(3) },
        shadowOpacity: 0.14,
        shadowRadius: vScale(8),
        elevation: 3,
    },
    cardStripe: {
        width: scale(3),
        alignSelf: 'stretch',
        borderTopRightRadius: scale(3),
        borderBottomRightRadius: scale(3),
        marginRight: scale(12),
    },
    iconBadge: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },
    cardBody: {
        flex: 1,
        gap: vScale(5),
    },
    medicineName: {
        fontSize: scale(14),
        fontWeight: '600',
        color: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
        letterSpacing: 0.1,
    },
    metaRow: {
        flexDirection: 'row',
        gap: scale(12),
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(3),
    },
    metaText: {
        fontSize: scale(11),
        color: 'rgba(238,246,162,0.45)',
        fontFamily: 'Aeonik-Medium',
    },
    pillsRow: {
        flexDirection: 'row',
        gap: scale(6),
        alignItems: 'center',
        marginTop: vScale(2),
    },
    freqPill: {
        paddingHorizontal: scale(9),
        paddingVertical: vScale(3),
        borderRadius: scale(20),
        borderWidth: 1,
    },
    freqPillText: {
        fontSize: scale(11),
        fontFamily: 'Aeonik-Medium',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    freqLabelPill: {
        paddingHorizontal: scale(8),
        paddingVertical: vScale(3),
        borderRadius: scale(20),
        backgroundColor: 'rgba(238,246,162,0.06)',
    },
    freqLabelText: {
        fontSize: scale(11),
        color: 'rgba(238,246,162,0.4)',
        fontFamily: 'Aeonik-Medium',
    },
    list: {
        paddingBottom: vScale(32),
    },
})

export default Medicines