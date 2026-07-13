import { scale } from '@/utils/scale'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
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

type SelectedDateRange = {
    startDate: Date | null
    endDate: Date | null
}

type Props = {
    SelectedCategories: string[]
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>
    SelectedDate: SelectedDateRange
    setSelectedDate: React.Dispatch<React.SetStateAction<SelectedDateRange>>
}

const Filters: React.FC<Props> = ({
    SelectedCategories,
    SelectedDate,
    setSelectedDate,
    setSelectedCategories
}) => {
    const [androidPickerOpen, setAndroidPickerOpen] = useState(false)
    const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null)
    const [customRange, setCustomRange] = useState<Date>()

    const presetRanges = buildPresetRanges([])

    const toggleFilter = (filter: string) => {
        setSelectedCategories((prev) => {
            const next = prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter]
            return next
        })
    }

    const applyRange = (range: DateRange | null) => {
        setSelectedRangeId(range?.id ?? null)
        setSelectedDate({
            startDate: range?.start ?? null,
            endDate: range?.end ?? null,
        })
    }

    const selectPreset = (range: DateRange) => {
        const isDeselecting = selectedRangeId === range.id
        applyRange(isDeselecting ? null : range)
    }

    const openCustomPicker = () => {
        setAndroidPickerOpen(true)
    }

    const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
        setAndroidPickerOpen(false)
        if (event.type !== 'set' || !date) return
        setCustomRange(date)
    }

    const customLabel = customRange
        ? `${formatShort(customRange)}`
        : 'Custom'


    useEffect(() => {
        if (customRange) {
            applyRange({
                id: CUSTOM_ID,
                label: customLabel,
                start: customRange,
                end: customRange,
            })
        }
    }, [customRange])

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Quick filters</Text>
                <View style={styles.chipWrap}>
                    {FILTER_OPTIONS.map((filter) => {
                        const isSelected = SelectedCategories.includes(filter)
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
                    value={SelectedDate.startDate || new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleAndroidChange}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // no flex here — this renders inside a ScrollView's content,
        // flex: 1 has nothing to expand against and collapses the layout
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
})

export default Filters