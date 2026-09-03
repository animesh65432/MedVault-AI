import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { SearchSuggestion as SearchSuggestionTypes } from "@/types"
import { fs } from '@/utils/fs'
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
    suggestion: SearchSuggestionTypes
}

function renderSnippet(snippet: string) {
    const parts = snippet.split(/(⟪.*?⟫)/g)
    return parts.map((part, i) => {
        if (part.startsWith('⟪') && part.endsWith('⟫')) {
            return (
                <Text key={i} style={styles.highlight}>
                    {part.slice(1, -1)}
                </Text>
            )
        }
        return <Text key={i}>{part}</Text>
    })
}

const Suggestion: React.FC<Props> = ({ suggestion }) => {
    const { thumbUri, thumbFailed } = usePdfThumbnail(suggestion.SourceFilePath, suggestion.IsPdf)
    const router = useRouter()
    return (
        <Pressable
            key={suggestion.documentId}
            style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
            ]}
            onPress={() => router.push(`/document/${suggestion.documentId}`)}
        >
            <View style={styles.iconWrapper}>
                {suggestion.IsPdf ? (
                    <>{thumbFailed ?
                        <View style={styles.pdfPlaceholder}>
                            <Feather name="file-text" size={fs(28)} color="#234338" />
                        </View> :
                        <Image
                            source={{ uri: thumbUri || suggestion.SourceFilePath }}
                            style={styles.Image}
                        />
                    }
                    </>
                ) : (
                    <Image
                        source={{ uri: suggestion.SourceFilePath }}
                        style={styles.Image}
                    />
                )}
            </View>
            <View style={styles.rowContent}>
                <View style={styles.rowHeader}>
                    <Text style={styles.title} numberOfLines={1}>
                        {suggestion.title}
                    </Text>
                    {suggestion.date && (
                        <Text style={styles.date}>{suggestion.date}</Text>
                    )}
                </View>
                <Text style={styles.field}>{suggestion.field}</Text>
                <Text style={styles.snippet} numberOfLines={2}>
                    {renderSnippet(suggestion.snippet)}
                </Text>
            </View>
        </Pressable>
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

export default Suggestion