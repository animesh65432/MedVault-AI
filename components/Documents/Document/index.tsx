import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { DocumentRow } from "@/types"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from "expo-router"
import React from "react"
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

type Props = {
    doc: DocumentRow
}

const Document: React.FC<Props> = ({ doc }) => {
    const router = useRouter()

    const { thumbUri, thumbFailed } = usePdfThumbnail(
        doc.SourceFilePath,
        doc.IsPdf
    )

    const date =
        doc.date && doc.date.trim().length > 0
            ? doc.date
            : null

    const hasTitle =
        doc.title && doc.title.trim().length > 0

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
                router.push(`/document/${doc.Id}`)
            }
        >
            {/* Preview */}
            <View style={styles.previewContainer}>
                {doc.IsPdf ? (
                    thumbUri ? (
                        <Image
                            source={{ uri: thumbUri }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                    ) : thumbFailed ? (
                        <View style={styles.pdfPlaceholder}>
                            <View style={styles.pdfIcon}>
                                <Text style={styles.pdfIconText}>
                                    PDF
                                </Text>
                            </View>

                            <Text style={styles.previewFallbackText}>
                                Preview unavailable
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="small"
                                color="#23423B"
                            />
                        </View>
                    )
                ) : (
                    <Image
                        source={{
                            uri: doc.SourceFilePath,
                        }}
                        style={styles.previewImage}
                        resizeMode="cover"
                    />
                )}

                {/* Document type badge */}
                <View
                    style={[
                        styles.typeBadge,
                        doc.IsPdf
                            ? styles.pdfBadge
                            : styles.imageBadge,
                    ]}
                >
                    <Text
                        style={[
                            styles.typeBadgeText,
                            doc.IsPdf
                                ? styles.pdfBadgeText
                                : styles.imageBadgeText,
                        ]}
                    >
                        {doc.IsPdf ? "PDF" : "JPG"}
                    </Text>
                </View>
            </View>

            {/* Information */}
            <View style={styles.info}>
                <Text
                    style={styles.documentType}
                    numberOfLines={1}
                >
                    {doc.type}
                </Text>

                {hasTitle && (
                    <Text
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {doc.title}
                    </Text>
                )}

                {date && (
                    <Text
                        style={styles.date}
                        numberOfLines={1}
                    >
                        {date}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(16),
        padding: scale(10),

        // Android
        elevation: 1,

        // iOS
        shadowColor: "#23423B",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },

    /* ---------------- Preview ---------------- */

    previewContainer: {
        width: "100%",
        height: vScale(145),
        borderRadius: scale(12),
        overflow: "hidden",
        backgroundColor: "#EEF3F1",
        position: "relative",
    },

    previewImage: {
        width: "100%",
        height: "100%",
    },

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEF3F1",
    },

    /* ---------------- PDF fallback ---------------- */

    pdfPlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEF6A2",
    },

    pdfIcon: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(10),
        backgroundColor: "#23423B",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: vScale(7),
    },

    pdfIconText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(11),
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },

    previewFallbackText: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(9),
        color: "#23423B",
    },

    /* ---------------- Badge ---------------- */

    typeBadge: {
        position: "absolute",
        top: scale(8),
        right: scale(8),

        paddingHorizontal: scale(7),
        paddingVertical: vScale(3),

        borderRadius: scale(6),
        borderWidth: 1,
    },

    pdfBadge: {
        backgroundColor: "#23423B",
        borderColor: "#23423B",
    },

    imageBadge: {
        backgroundColor: "#FAFAF8",
        borderColor: "#D5E0DD",
    },

    typeBadgeText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(9),
        letterSpacing: 0.4,
    },

    pdfBadgeText: {
        color: "#FFFFFF",
    },

    imageBadgeText: {
        color: "#5A7A74",
    },

    /* ---------------- Information ---------------- */

    info: {
        paddingHorizontal: scale(3),
        paddingTop: vScale(10),
    },

    documentType: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(14),
        color: "#23423B",
        marginBottom: vScale(4),
    },

    title: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(12),
        lineHeight: scale(16),
        color: "#5A7A74",
    },

    date: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(11),
        color: "#8AA19C",
        marginTop: vScale(5),
    },
})

export default Document