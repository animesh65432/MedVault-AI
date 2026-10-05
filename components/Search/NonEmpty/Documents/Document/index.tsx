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
    selectedIds: number[]
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
    SetCurrentDate?: React.Dispatch<React.SetStateAction<string>>
}

const Document: React.FC<Props> = ({ doc, selectedIds, setSelectedIds }) => {
    const router = useRouter()

    const { thumbUri, thumbFailed } = usePdfThumbnail(
        doc.SourceFilePath,
        doc.IsPdf
    )

    const selectionMode = selectedIds.length > 0
    const isSelected = selectedIds.includes(doc.Id)

    const toggleSelect = () => {
        setSelectedIds((prev) =>
            prev.includes(doc.Id)
                ? prev.filter((id) => id !== doc.Id)
                : [...prev, doc.Id]
        )
    }

    const handlePress = () => {
        if (selectionMode) {
            toggleSelect()
            return
        }
        if (doc.date) {
            router.push(`/document/${doc.Id}`)
        }
    }

    const renderPreview = () => {
        if (!doc.IsPdf) {
            return (
                <Image
                    source={{ uri: doc.SourceFilePath }}
                    style={styles.previewImage}
                    resizeMode="cover"
                />
            )
        }

        if (thumbUri) {
            return (
                <Image
                    source={{ uri: thumbUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                />
            )
        }

        if (thumbFailed) {
            return (
                <View style={styles.pdfPlaceholder}>
                    <View style={styles.pdfIcon}>
                        <Text style={styles.pdfIconText}>PDF</Text>
                    </View>
                    <Text style={styles.previewFallbackText}>
                        Preview unavailable
                    </Text>
                </View>
            )
        }

        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#23423B" />
            </View>
        )
    }

    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            activeOpacity={0.8}
            onPress={handlePress}
            onLongPress={toggleSelect}
            delayLongPress={300}
        >
            <View
                style={[
                    styles.previewContainer,
                    isSelected && styles.previewSelected,
                ]}
            >
                {renderPreview()}
            </View>

            {selectionMode && (
                <View
                    style={[styles.circle, isSelected && styles.circleSelected]}
                >
                    {isSelected && <Text style={styles.checkText}>✓</Text>}
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: "30%",
        backgroundColor: "#FAFAF8",
        elevation: 1,
        shadowColor: "#23423B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        borderRadius: scale(10),
    },
    cardSelected: {
        backgroundColor: "#DDE8E4",
    },

    previewContainer: {
        width: "100%",
        height: vScale(160),
        overflow: "hidden",
        position: "relative",
        borderRadius: scale(10),
    },
    previewSelected: {
        transform: [{ scale: 0.86 }],
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

    /* ---------------- Selection ---------------- */

    circle: {
        position: "absolute",
        top: scale(8),
        left: scale(8),
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        borderWidth: 2,
        borderColor: "#FFFFFF",
        backgroundColor: "rgba(0,0,0,0.25)",
        alignItems: "center",
        justifyContent: "center",
    },
    circleSelected: {
        backgroundColor: "#23423B",
    },
    checkText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(12),
        color: "#FFFFFF",
    },
})

export default Document