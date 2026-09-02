import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { DocumentRow } from '@/types'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    doc: DocumentRow
}

const getDate = (doc: DocumentRow): string | null => {
    return doc.date && doc.date.trim().length > 0 ? doc.date : null
}

const Document: React.FC<Props> = ({ doc }) => {
    const router = useRouter()
    const { thumbUri, thumbFailed } = usePdfThumbnail(doc.SourceFilePath, doc.IsPdf)
    return (
        <TouchableOpacity
            key={doc.Id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/document/${doc.Id}`)}
        >
            <View style={styles.iconWrapper}>
                {doc.IsPdf ? (
                    thumbUri ? (
                        <Image source={{ uri: thumbUri }} style={styles.Image} resizeMode="cover" />
                    ) : thumbFailed ? (
                        <View style={styles.pdfPlaceholder}>
                            <Text style={styles.pdfPlaceholderText}>PDF</Text>
                        </View>
                    ) : (
                        <ActivityIndicator size="small" color="#234338" />
                    )
                ) : (
                    <Image
                        source={{ uri: doc.SourceFilePath }}
                        style={styles.Image}
                    />
                )}
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.type}>{doc.type}</Text>
                {getDate(doc) && (
                    <Text style={styles.date}>{getDate(doc)}</Text>
                )}
                {doc.title.length > 0 && (
                    <Text
                        style={styles.subtitle}
                        numberOfLines={2}
                    >
                        {doc.title}
                    </Text>
                )}
            </View>
            <View style={[styles.badge, doc.IsPdf ? styles.badgePdf : styles.badgeImg]}>
                <Text style={[styles.doctype, doc.IsPdf ? styles.doctypePdf : styles.doctypeImg]}>
                    {doc.IsPdf ? "PDF" : "JPG"}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(14),
        padding: scale(14),
        gap: scale(12),
        height: vScale(180),
    },
    iconWrapper: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(10),
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    textWrapper: {
        flex: 1,
        gap: vScale(6),
    },
    type: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#23423B",
    },
    date: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(13),
        color: "#5A7A74",
    },
    subtitle: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(13),
        color: "#5A7A74",
    },
    emptyContainer: {
        paddingVertical: vScale(24),
        alignItems: "center",
    },
    emptyText: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(14),
        color: "#5A7A74",
    },
    Image: {
        width: "100%",
        height: "100%",
    },
    badge: {
        paddingHorizontal: scale(8),
        paddingVertical: vScale(2),
        borderRadius: scale(20),
        borderWidth: 1,
        alignSelf: "flex-start",
    },
    badgePdf: {
        borderColor: "#234338",
        backgroundColor: "#23433814",
    },
    badgeImg: {
        borderColor: "#5A7A74",
        backgroundColor: "#5A7A7414",
    },
    doctype: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(10),
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    doctypePdf: {
        color: "#234338",
    },
    doctypeImg: {
        color: "#5A7A74",
    },
    pdfPlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#EEF6A2",
        alignItems: "center",
        justifyContent: "center",
    },
    pdfPlaceholderText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(11),
        color: "#234338",
    },
})

export default Document