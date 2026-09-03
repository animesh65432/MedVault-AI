import { SearchSuggestion } from '@/types'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Empty from '../Empty'
import Suggestion from './Suggestion'

type Props = {
    SearchSuggestions: SearchSuggestion[]
}
const Suggestions: React.FC<Props> = ({ SearchSuggestions }) => {
    const router = useRouter()

    if (SearchSuggestions.length === 0) {
        return <Empty hasQuery={true} />
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
        >
            {SearchSuggestions.map((item) => (
                <Suggestion
                    key={item.documentId}
                    suggestion={item} />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: scale(20),
        paddingTop: vScale(14),
        paddingBottom: vScale(32),
        gap: vScale(10),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(10),
        backgroundColor: '#FAFAF8',
        borderRadius: scale(12),
        padding: scale(14),
    },
    rowPressed: {
        opacity: 0.6,
    },
    iconWrapper: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(10),
        alignItems: "center",
        justifyContent: "center",
    },
    rowContent: {
        flex: 1,
        gap: vScale(4),
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: scale(8),
    },
    title: {
        flex: 1,
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(14),
        color: '#23423B',
    },
    date: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(11),
        color: '#5A7A74',
    },
    field: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(11),
        color: '#5A7A74',
    },
    snippet: {
        fontFamily: 'Aeonik-Regular',
        fontSize: fs(12),
        color: '#23423B',
        lineHeight: fs(16),
    },
    highlight: {
        backgroundColor: '#EEF6A2',
        fontFamily: 'Aeonik-Medium',
    },
    Image: {
        width: "100%",
        height: "100%",
    },
    pdfPlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#EEF6A2",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default Suggestions