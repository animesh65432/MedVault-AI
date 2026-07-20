import { scale } from '@/utils/scale'
import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'

type Props = {
    isVisible: boolean
    onClose: () => void
    onApply: (start: Date, end: Date) => void
}

const toDateString = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const getMarkedDates = (start: string | null, end: string | null) => {
    const marked: Record<string, any> = {}

    if (!start) return marked

    if (!end) {
        marked[start] = {
            startingDay: true,
            endingDay: true,
            color: '#23423B',
            textColor: '#FFFFFF',
        }
        return marked
    }

    const cursor = new Date(start)
    const last = new Date(end)

    while (cursor <= last) {
        const date = toDateString(cursor)
        marked[date] = {
            color: date === start || date === end ? '#23423B' : '#23423B99',
            textColor: '#FFFFFF',
            startingDay: date === start,
            endingDay: date === end,
        }
        cursor.setDate(cursor.getDate() + 1)
    }

    return marked
}

const CustomCalender: React.FC<Props> = ({ isVisible, onClose, onApply }) => {
    const [startDate, setStartDate] = useState<string | null>(null)
    const [endDate, setEndDate] = useState<string | null>(null)

    const onDayPress = (day: DateData) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day.dateString)
            setEndDate(null)
            return
        }

        if (day.dateString >= startDate) {
            setEndDate(day.dateString)
        } else {
            setStartDate(day.dateString)
        }
    }

    const reset = () => {
        setStartDate(null)
        setEndDate(null)
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleApply = () => {
        if (!startDate) return
        const end = endDate || startDate
        onApply(new Date(startDate), new Date(end))
        reset()
        onClose()
    }

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View
                style={styles.backdrop}
            >
                <View style={styles.card}>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={getMarkedDates(startDate, endDate)}
                        markingType="period"
                        maxDate={toDateString(new Date())}
                        theme={{
                            selectedDayBackgroundColor: '#23423B',
                            todayTextColor: '#23423B',
                            arrowColor: '#23423B',
                            textDayFontFamily: 'Aeonik-Medium',
                            textMonthFontFamily: 'Aeonik-Medium',
                            textDayHeaderFontFamily: 'Aeonik-Medium',
                        }}
                    />

                    <View style={styles.actions}>
                        <Pressable style={styles.cancelBtn} onPress={handleClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.applyBtn, !startDate && styles.applyBtnDisabled]}
                            onPress={handleApply}
                            disabled={!startDate}
                        >
                            <Text style={styles.applyText}>Apply</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: "space-around",
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        padding: scale(16),
        paddingBottom: scale(28),
    },
    title: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(16),
        color: '#23423B',
        marginBottom: scale(12),
    },
    actions: {
        flexDirection: 'row',
        gap: scale(10),
        marginTop: scale(16),
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: scale(12),
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: '#23423B33',
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: 'Aeonik-Medium',
        color: '#23423B',
        fontSize: scale(14),
    },
    applyBtn: {
        flex: 1,
        paddingVertical: scale(12),
        borderRadius: scale(10),
        backgroundColor: '#23423B',
        alignItems: 'center',
    },
    applyBtnDisabled: {
        backgroundColor: '#23423B55',
    },
    applyText: {
        fontFamily: 'Aeonik-Medium',
        color: '#FFFFFF',
        fontSize: scale(14),
    },
})

export default CustomCalender