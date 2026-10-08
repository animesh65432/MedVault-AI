import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { DocumentRow } from "@/types"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'

type Props = {
    document: DocumentRow
}

const NavbarPhoto: React.FC<Props> = ({ document }) => {
    const { thumbUri, thumbFailed } = usePdfThumbnail(document.SourceFilePath, document.IsPdf);

    const renderPreview = () => {
        if (!document.IsPdf) {
            return (
                <Image
                    source={{ uri: document.SourceFilePath }}
                    style={styles.previewImage}
                    resizeMode="stretch"
                />
            )
        }

        if (thumbUri) {
            return (
                <Image
                    source={{ uri: thumbUri }}
                    style={styles.previewImage}
                    resizeMode="stretch"
                />
            )
        }

        if (thumbFailed) {
            return (
                <View style={styles.pdfIcon}>
                    <Text style={styles.pdfIconText}>PDF</Text>
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
        <>
            {renderPreview()}
        </>
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
        shadowRadius: 5
    },
    cardSelected: {
        backgroundColor: "#DDE8E4",
    },

    previewContainer: {
        width: "100%",
        height: vScale(160),
        overflow: "hidden",
        position: "relative"
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

    pdfIcon: {
        width: "100%",
        height: "100%",
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
        fontFamily: "Aeonik-Medium",
        fontSize: scale(12),
        color: "#23423B",
        textAlign: "center"
    },
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

export default NavbarPhoto