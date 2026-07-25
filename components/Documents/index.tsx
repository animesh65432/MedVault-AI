import { DocumentRow } from "@/types"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { Feather } from "@expo/vector-icons"
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"


type Props = {
    documents: DocumentRow[],
    IsHome?: boolean
}


const getDate = (doc: DocumentRow): string | null => {
    return doc.date && doc.date.trim().length > 0 ? doc.date : null
}

const Documents: React.FC<Props> = ({ documents, IsHome = false }) => {
    const router = useRouter()

    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No documents yet</Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, { marginBottom: !IsHome ? vScale(100) : vScale(20) }]}>
            {documents.map((doc) => {
                return (
                    <TouchableOpacity
                        key={doc.Id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/document/${doc.Id}`)}
                    >
                        <View style={styles.iconWrapper}>
                            {doc.IsPdf ? (
                                <View style={styles.pdfPlaceholder}>
                                    <Feather name="file-text" size={fs(28)} color="#234338" />
                                </View>
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
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: vScale(12)
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(14),
        padding: scale(14),
        gap: scale(12),
    },
    iconWrapper: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(10),
        alignItems: "center",
        justifyContent: "center",
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
        backgroundColor: "#23433814", // ~8% tint
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
})

export default Documents