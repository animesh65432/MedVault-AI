import { DoseLogRow } from '@/db/medicines'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    doseLog: DoseLogRow[]
    onTakeNow?: (log: DoseLogRow) => void
    onSnooze?: (log: DoseLogRow) => void
}

const STATUS_LABEL: Record<DoseLogRow["Status"], string> = {
    taken: "Taken",
    missed: "Missed",
    snoozed: "Snoozed",
    pending: "Pending",
}

const isToday = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    )
}

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const Dose: React.FC<Props> = ({ doseLog, onTakeNow, onSnooze }) => {
    if (!doseLog || doseLog.length === 0) return null

    const todaysDoses = doseLog.filter(
        (log) => isToday(log.ScheduledTime) && log.Status !== "taken"
    )
    const history = doseLog.filter(
        (log) => !isToday(log.ScheduledTime) || log.Status === "taken"
    )

    return (
        <View style={style.Container}>
            {todaysDoses.length > 0 && (
                <View style={style.section}>
                    <Text style={style.sectionTitle}>Today's dose</Text>
                    {todaysDoses.map((log) => (
                        <View key={log.Id} style={style.doseCard}>
                            <View style={style.doseCardTop}>
                                <View>
                                    <Text style={style.doseTime}>{formatTime(log.ScheduledTime)} dose</Text>
                                    <Text style={style.doseStatus}>{STATUS_LABEL[log.Status]}</Text>
                                </View>
                            </View>
                            <View style={style.actionRow}>
                                <TouchableOpacity
                                    style={style.takeButton}
                                    onPress={() => onTakeNow?.(log)}
                                >
                                    <Text style={style.takeButtonText}>Take now</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={style.snoozeButton}
                                    onPress={() => onSnooze?.(log)}
                                >
                                    <Text style={style.snoozeButtonText}>Snooze</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {history.length > 0 && (
                <View style={style.section}>
                    <Text style={style.sectionTitle}>Dose history</Text>
                    {history.map((log) => (
                        <View key={log.Id} style={style.historyRow}>
                            <Text style={style.historyDate}>{formatTime(log.ScheduledTime)}</Text>
                            <View style={[style.statusBadge, style[`badge_${log.Status}`]]}>
                                <Text style={style.statusText}>{STATUS_LABEL[log.Status]}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        paddingHorizontal: scale(20),
        gap: scale(20),
    },
    section: {
        gap: scale(10),
    },
    sectionTitle: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        color: "#234338",
    },
    doseCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: scale(12),
        padding: scale(12),
        gap: scale(10),
    },
    doseCardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    doseTime: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        color: "#234338",
    },
    doseStatus: {
        fontFamily: "Aeonik-Regular",
        fontSize: fs(12),
        color: "#9CA3AF",
    },
    actionRow: {
        flexDirection: "row",
        gap: scale(8),
    },
    takeButton: {
        flex: 1,
        backgroundColor: "#0D483F",
        borderRadius: scale(10),
        paddingVertical: scale(8),
        alignItems: "center",
    },
    takeButtonText: {
        color: "#D9F99D",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13),
    },
    snoozeButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: scale(10),
        paddingVertical: scale(8),
        alignItems: "center",
    },
    snoozeButtonText: {
        color: "#234338",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13),
    },
    historyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: scale(8),
    },
    historyDate: {
        fontFamily: "Aeonik-Regular",
        fontSize: fs(13),
        color: "#234338",
    },
    statusBadge: {
        borderRadius: scale(8),
        paddingHorizontal: scale(8),
        paddingVertical: scale(3),
    },
    statusText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(11),
    },
    badge_taken: {
        backgroundColor: "#DCFCE7",
    },
    badge_missed: {
        backgroundColor: "#FEE2E2",
    },
    badge_snoozed: {
        backgroundColor: "#FEF3C7",
    },
    badge_pending: {
        backgroundColor: "#F3F4F6",
    },
})

export default Dose