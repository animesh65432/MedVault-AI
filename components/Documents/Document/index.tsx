import { DocIcon } from "@/components/DocIcon"
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
    View
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

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
                router.push(`/document/${doc.Id}`)
            }
        >
            <View style={styles.previewContainer}>
                {doc.IsPdf ? (
                    thumbUri ? (
                        <Image
                            source={{ uri: thumbUri }}
                            style={styles.previewImage}
                            resizeMode="stretch"
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
                        resizeMode="stretch"
                    />
                )}
                <View />
                <View style={styles.documentType}>
                    <DocIcon
                        type={doc.type}
                    />
                    <Text style={styles.documentTypeText}>
                        {doc.type}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: "60%",
        backgroundColor: "#FAFAF8",
        elevation: 1,
        shadowColor: "#23423B",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    previewContainer: {
        width: "100%",
        height: vScale(200),
        borderRadius: scale(12),
        overflow: "hidden",
        backgroundColor: "red",
        position: "relative"
    },

    previewImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
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
        backgroundColor: "#23423B",
        marginBottom: vScale(4),
        padding: scale(2),
        paddingLeft: scale(12),
        paddingRight: scale(12),
        borderRadius: scale(16),
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6),
        position: "absolute",
        top: vScale(10),
        left: scale(10),
    },
    documentTypeText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(14),
        color: "#FFFFFF",
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