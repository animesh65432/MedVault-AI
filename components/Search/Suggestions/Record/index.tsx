import { RecordSuggestion } from '@/types'
import { formatDate } from '@/utils/formatDate'
import { parseDbDate } from "@/utils/parseDbDate"
import { scale } from '@/utils/scale'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { renderSnippet } from '../Suggestion'

type Props = { record: RecordSuggestion }


const Record: React.FC<Props> = ({ record }) => {
    const date = parseDbDate(record.date);
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/RecordDetails/${record.recordId}`)}
        >
            <View style={styles.iconWrap}>
                <Feather name="folder" size={scale(22)} color="#0D483F" />
            </View>

            <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>
                    {renderSnippet(record.snippet)}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{record.field}</Text>
                    </View>
                    <>
                        <View style={styles.dot} />
                        <Feather name="calendar" size={scale(12)} color="#6B7B76" />

                        {date && (
                            <Text style={styles.date}>{formatDate(date.toISOString())}</Text>
                        )}
                    </>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FAFAF8',
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#E3E8E5',
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EEF6A2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: { flex: 1, gap: 6 },
    title: {
        fontSize: 15,
        color: '#0D483F',
        fontFamily: 'Aeonik-Medium', // match your font key
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    badge: {
        backgroundColor: '#0D483F',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 11,
        color: '#D9F99D',
        fontFamily: 'Aeonik-Regular',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#A3B1AC',
    },
    date: {
        fontSize: 12,
        color: '#6B7B76',
        fontFamily: 'Aeonik-Regular',
    },
})

export default Record