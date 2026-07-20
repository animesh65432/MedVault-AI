import { FILTER_OPTIONS } from '@/utils/contensnt'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import CustomCalender from '../../CustomCalender'

const VISIBLE_FILTER_COUNT = 4

type DateRange = {
    id: string
    label: string
    start: Date
    end: Date
}

const CUSTOM_ID = 'custom'

const QUICK_RANGES = (now: Date): DateRange[] => {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLast3Months = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    return [
        { id: 'this_month', label: 'This month', start: startOfMonth, end: now },
        { id: 'last_3_months', label: 'Last 3 months', start: startOfLast3Months, end: now },
    ]
}

const buildYearRanges = (documentDates: Date[] = [], now: Date): DateRange[] => {
    const years = documentDates.length
        ? Array.from(new Set(documentDates.map((d) => d.getFullYear()))).sort((a, b) => b - a)
        : [now.getFullYear()]

    return years.map((year) => ({
        id: String(year),
        label: String(year),
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31, 23, 59, 59),
    }))
}

const formatShort = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const formatRangeLabel = (start: Date, end: Date) => {
    const sameYear = start.getFullYear() === end.getFullYear()
    const startLabel = start.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: sameYear ? undefined : 'numeric',
    })
    return `${startLabel} - ${formatShort(end)}`
}

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
    setSelectedDate,
    setSelectedCategories
}) => {
    const [showCustomCalender, setShowCustomCalender] = useState(false)
    const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null)
    const [customStart, setCustomStart] = useState<Date | null>(null)
    const [customEnd, setCustomEnd] = useState<Date | null>(null)
    const [showAllFilters, setShowAllFilters] = useState(false)

    const now = new Date()
    const quickRanges = QUICK_RANGES(now)
    const yearRanges = buildYearRanges([], now)

    const visibleFilters = showAllFilters
        ? FILTER_OPTIONS
        : FILTER_OPTIONS.slice(0, VISIBLE_FILTER_COUNT)

    const hiddenCount = FILTER_OPTIONS.length - VISIBLE_FILTER_COUNT

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
        setShowCustomCalender(true)
    }

    const handleChange = (start: Date | null, end: Date | null) => {
        if (!start || !end) {
            return
        }
        setCustomStart(start)
        setCustomEnd(end)
        applyRange({
            id: CUSTOM_ID,
            label: formatRangeLabel(start, end),
            start,
            end,
        })
    }

    const onCloseCustomCalender = () => {
        setShowCustomCalender(false)
    }

    const isCustomSelected = selectedRangeId === CUSTOM_ID
    const customLabel = customStart && customEnd
        ? formatRangeLabel(customStart, customEnd)
        : 'Custom range'

    const resetDate = () => {
        setSelectedRangeId(null)
        setCustomStart(null)
        setCustomEnd(null)
        setSelectedDate({ startDate: null, endDate: null })
        setSelectedCategories(["All Records"])
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Quick filters</Text>
                    <Text
                        style={styles.ClearAll}
                        onPress={resetDate}
                    >
                        Clear All
                    </Text>
                </View>
                <View style={styles.chipWrap}>
                    {visibleFilters.map((filter) => {
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

                    <Pressable
                        onPress={() => setShowAllFilters((prev) => !prev)}
                        style={[styles.chip, styles.moreChip]}
                    >
                        <Text style={styles.chipText}>
                            {showAllFilters ? 'Show less' : `+${hiddenCount} more`}
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.dateSectionConatainer}>
                <View style={styles.Browse_By_Date_Container}>
                    <Text style={styles.title}>Browse by date</Text>
                    <Pressable onPress={openCustomPicker} hitSlop={scale(8)}>
                        <Text style={[styles.custom_range, isCustomSelected && styles.customRangeActive]}>
                            {isCustomSelected ? customLabel : 'Custom Range'}
                        </Text>
                    </Pressable>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateRow}
                >
                    {quickRanges.map((range) => {
                        const isSelected = selectedRangeId === range.id
                        return (
                            <Pressable
                                key={range.id}
                                onPress={() => selectPreset(range)}
                                style={[styles.datePill, isSelected && styles.datePillSelected]}
                            >
                                <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                                    Period
                                </Text>
                                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                    {range.label}
                                </Text>
                            </Pressable>
                        )
                    })}

                    {yearRanges.map((range) => {
                        const isSelected = selectedRangeId === range.id
                        return (
                            <Pressable
                                key={range.id}
                                onPress={() => selectPreset(range)}
                                style={[styles.datePill, isSelected && styles.datePillSelected]}
                            >
                                <Text style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}>
                                    Year
                                </Text>
                                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                    {range.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </ScrollView>
            </View>
            <CustomCalender
                isVisible={showCustomCalender}
                onClose={onCloseCustomCalender}
                onApply={handleChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: scale(10)
    },
    titleRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    section: {
        marginBottom: scale(20),
    },
    title: {
        color: '#708090',
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        marginBottom: scale(12),
        textTransform: "uppercase"
    },
    yearLabel: {
        color: '#708090',
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(11),
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    yearLabelRow: {
        marginTop: scale(2),
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
    moreChip: {
        backgroundColor: '#FAFAF8',
        borderWidth: 1,
        borderColor: '#5A7A74',
        borderStyle: 'dashed',
    },
    yearPill: {
        paddingVertical: scale(8),
        paddingHorizontal: scale(16),
        borderRadius: scale(20),
        backgroundColor: '#FAFAF8',
        borderWidth: 1,
        borderColor: '#23423B33',
    },
    divider: {
        width: 1,
        height: scale(16),
        backgroundColor: '#23423B22',
        marginHorizontal: scale(2),
    },
    customDatePill: {
        paddingVertical: scale(8),
        paddingHorizontal: scale(16),
        borderRadius: scale(20),
        backgroundColor: '#FAFAF8',
        borderWidth: 1,
        borderColor: '#5A7A74',
        borderStyle: 'dashed',
    },
    datePillSelected: {
        backgroundColor: '#23423B',
        borderColor: '#23423B',
    },
    customDateText: {
        color: '#5A7A74',
    },
    dateSectionConatainer: {
        gap: scale(10),
    },
    Browse_By_Date_Container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    custom_range: {
        color: '#23423B',
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        textDecorationLine: 'underline',
    },
    customRangeActive: {
        color: '#5A7A74',
    },
    dateRow: {
        flexDirection: 'row',
        gap: scale(8),
    },
    datePill: {
        paddingVertical: scale(6),
        paddingHorizontal: scale(14),
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: '#23423B22',
        backgroundColor: '#FAFAF8',
        alignItems: 'flex-start',
        minWidth: scale(72),
    },
    pillLabel: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(9),
        color: '#708090',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: scale(2),
    },
    pillLabelSelected: {
        color: '#EEF6A2',
    },
    dateText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(13),
        color: '#23423B',
    },
    dateTextSelected: {
        color: '#FFFFFF',
    },
    ClearAll: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
        textDecorationLine: 'underline',
    }
})

export default Filters