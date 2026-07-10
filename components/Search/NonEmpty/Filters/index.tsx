import { scale } from '@/utils/scale'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const FILTER_OPTIONS = [
    'Prescription',
    'Prescription Receipt',
    'Lab Report',
    'Radiology Report',
    'Medical Bill',
    'Discharge Summary',
    'Referral Letter',
    'Insurance Document',
    'Consent Form',
    'Medical History Record',
    'Other'
]

type DateRange = {
    id: string
    label: string
    start: Date
    end: Date
}

const CUSTOM_ID = 'custom'

const buildPresetRanges = (documentDates: Date[] = []): DateRange[] => {
    const now = new Date()

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLast3Months = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    const ranges: DateRange[] = [
        { id: 'this_month', label: 'This month', start: startOfMonth, end: now },
        { id: 'last_3_months', label: 'Last 3 months', start: startOfLast3Months, end: now },
    ]

    const years = documentDates.length
        ? Array.from(new Set(documentDates.map((d) => d.getFullYear()))).sort((a, b) => b - a)
        : [now.getFullYear()]

    years.forEach((year) => {
        ranges.push({
            id: String(year),
            label: String(year),
            start: new Date(year, 0, 1),
            end: new Date(year, 11, 31, 23, 59, 59),
        })
    })

    return ranges
}

const formatShort = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

type FiltersProps = {
    documentDates?: Date[]
    onFilterChange?: (selected: string[]) => void
    onDateRangeChange?: (range: DateRange | null) => void
}

const Filters = ({ documentDates, onFilterChange, onDateRangeChange }: FiltersProps) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null)
    const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | null>(null)

    const [pickerStep, setPickerStep] = useState<'start' | 'end'>('start')
    const [draftStart, setDraftStart] = useState<Date>(new Date())
    const [draftEnd, setDraftEnd] = useState<Date>(new Date())
    const [androidPickerOpen, setAndroidPickerOpen] = useState(false)

    const presetRanges = useMemo(() => buildPresetRanges(documentDates), [documentDates])

    const toggleFilter = (filter: string) => {
        setSelectedFilters((prev) => {
            const next = prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter]
            onFilterChange?.(next)
            return next
        })
    }

    const applyRange = (range: DateRange | null) => {
        setSelectedRangeId(range?.id ?? null)
        onDateRangeChange?.(range)
    }

    const selectPreset = (range: DateRange) => {
        const isDeselecting = selectedRangeId === range.id
        setCustomRange(null)
        applyRange(isDeselecting ? null : range)
    }

    const openCustomPicker = () => {
        const baseStart = customRange?.start ?? new Date()
        const baseEnd = customRange?.end ?? new Date()
        setDraftStart(baseStart)
        setDraftEnd(baseEnd)
        setPickerStep('start')
        setAndroidPickerOpen(true)
    }

    const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
        setAndroidPickerOpen(false)
        if (event.type !== 'set' || !date) return

        if (pickerStep === 'start') {
            setDraftStart(date)
            setPickerStep('end')
            setAndroidPickerOpen(true)
        } else {
            const finalRange = { start: draftStart, end: date }
            setCustomRange(finalRange)
            applyRange({ id: CUSTOM_ID, label: `${formatShort(finalRange.start)} – ${formatShort(finalRange.end)}`, ...finalRange })
        }
    }

    const customLabel = customRange
        ? `${formatShort(customRange.start)} – ${formatShort(customRange.end)}`
        : 'Custom'

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Quick filters</Text>
                <View style={styles.chipWrap}>
                    {FILTER_OPTIONS.map((filter) => {
                        const isSelected = selectedFilters.includes(filter)
                        return (
                            <Pressable
                                key={filter}
                                onPress={() => toggleFilter(filter)}
                                style={[styles.chip, isSelected && styles.chipSelected]}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                    {filter}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>Browse by date</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateRow}
                >
                    {presetRanges.map((range) => {
                        const isSelected = selectedRangeId === range.id
                        return (
                            <Pressable
                                key={range.id}
                                onPress={() => selectPreset(range)}
                                style={[styles.datePill, isSelected && styles.datePillSelected]}
                            >
                                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                    {range.label}
                                </Text>
                            </Pressable>
                        )
                    })}

                    <Pressable
                        onPress={openCustomPicker}
                        style={[
                            styles.datePill,
                            styles.customPill,
                            selectedRangeId === CUSTOM_ID && styles.datePillSelected,
                        ]}
                    >
                        <Text style={[styles.dateText, selectedRangeId === CUSTOM_ID && styles.dateTextSelected]}>
                            {customLabel}
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>

            {androidPickerOpen && (
                <DateTimePicker
                    value={pickerStep === 'start' ? draftStart : draftEnd}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    minimumDate={pickerStep === 'end' ? draftStart : undefined}
                    onChange={handleAndroidChange}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: scale(20),
    },
    title: {
        color: '#23423B',
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(18),
        marginBottom: scale(12),
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(8),
    },
    chip: {
        paddingVertical: scale(8),
        paddingHorizontal: scale(14),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: '#23423B33',
        backgroundColor: '#FFFFFF',
    },
    chipSelected: {
        backgroundColor: '#23423B',
        borderColor: '#23423B',
    },
    chipText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(13),
        color: '#23423B',
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
    dateRow: {
        flexDirection: 'row',
        gap: scale(10),
    },
    datePill: {
        paddingVertical: scale(8),
        paddingHorizontal: scale(16),
        borderRadius: scale(20),
        backgroundColor: '#F2F2F2',
    },
    datePillSelected: {
        backgroundColor: '#23423B',
    },
    customPill: {
        borderWidth: 1,
        borderColor: '#23423B55',
        borderStyle: 'dashed',
    },
    dateText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(13),
        color: '#23423B',
    },
    dateTextSelected: {
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        paddingTop: scale(16),
        paddingBottom: scale(24),
        paddingHorizontal: scale(20),
    },
    stepToggle: {
        flexDirection: 'row',
        gap: scale(12),
        marginBottom: scale(8),
    },
    stepButton: {
        flex: 1,
        paddingVertical: scale(10),
        borderRadius: scale(12),
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
    },
    stepLabel: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(12),
        color: '#23423B99',
        textAlign: 'center',
        lineHeight: scale(16),
    },
    stepLabelActive: {
        color: '#23423B',
    },
    modalActions: {
        flexDirection: 'row',
        gap: scale(12),
        marginTop: scale(12),
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: scale(12),
        borderRadius: scale(12),
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    modalCancelText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#23423B',
    },
    modalConfirmButton: {
        flex: 1,
        paddingVertical: scale(12),
        borderRadius: scale(12),
        alignItems: 'center',
        backgroundColor: '#23423B',
    },
    modalConfirmText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: '#FFFFFF',
    },
})

export default Filters