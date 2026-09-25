import { DocIcon } from "@/components/DocIcon"
import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { DocumentRow } from "@/types"
import { formatDate } from "@/utils/formatDate"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { FontAwesome } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    document: DocumentRow
}

const OneDocument: React.FC<Props> = ({ document }) => {
    const router = useRouter()
    const { thumbUri, thumbFailed } = usePdfThumbnail(document.SourceFilePath)
    const [loadError, setLoadError] = useState(false)

    const hasImage = document.IsPdf
        ? (!thumbFailed && !!thumbUri && !loadError)
        : (!!document.SourceFilePath && !loadError)

    const source = document.IsPdf ? thumbUri : document.SourceFilePath
    return (
        <TouchableOpacity
            style={styles.wrap}
            onPress={() => router.push({
                pathname: "/document/[id]",
                params: { id: String(document.Id) },
            })}
        >
            {hasImage ? (
                <ImageBackground
                    source={{ uri: source ?? undefined }}
                    style={styles.tile}
                    imageStyle={styles.tileImage}
                    resizeMode="cover"
                    onError={() => setLoadError(true)}
                >
                    <View style={styles.overlay} />
                    <View style={styles.doc_type_container}>
                        <DocIcon
                            type={document.type}
                        />
                        <Text style={styles.doc_type_text}>{document.type}</Text>
                    </View>
                    <View style={styles.overlayTextWrap}>
                        <Text style={styles.title} numberOfLines={2}>{document.title}</Text>
                        <Text style={styles.date}>{formatDate(document.date)}</Text>
                    </View>
                </ImageBackground>
            ) : (
                <View style={[styles.tile, styles.fallback]}>
                    <View style={styles.doc_type_container}>
                        <DocIcon
                            type={document.type}
                        />
                        <Text style={styles.doc_type_text}>{document.type}</Text>
                    </View>

                    <View style={styles.fallbackBody}>
                        <FontAwesome
                            name="file-pdf-o"
                            size={scale(40)}
                            color="#0D483F"
                        />
                        <View style={styles.fallbackTextWrap}>
                            <Text style={styles.fallbackTitle} numberOfLines={2}>{document.title}</Text>
                            <Text style={styles.fallbackDate}>{document.date}</Text>
                        </View>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrap: {
        aspectRatio: 1,
    },
    tile: {
        width: "100%",
        height: vScale(240),
        borderRadius: scale(15),
        overflow: 'hidden',
    },
    tileImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: undefined,
        height: undefined,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlayTextWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: scale(10),
        alignItems: 'center',
        backgroundColor: "white",
        height: vScale(70),
        padding: scale(8),
        gap: vScale(5)
    },
    fallback: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d8d6d6',
    },
    fallbackBody: {
        alignItems: 'center',
        gap: vScale(12),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "70%",
        width: "100%",
        marginTop: "auto"
    },
    fallbackTextWrap: {
        alignItems: 'center',
        gap: vScale(2),
        backgroundColor: "white",
        padding: scale(8),
        width: "100%",
    },
    title: {
        fontSize: scale(14),
        fontFamily: 'Aeonik-Medium',
        color: 'black',
        marginRight: "auto"
    },
    date: {
        fontSize: scale(13),
        fontFamily: 'Aeonik-Medium',
        color: "#5c5f5f",
        opacity: 0.8,
        marginRight: "auto",
    },
    doc_type_container: {
        position: 'absolute',
        top: 4,
        left: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 6,
        backgroundColor: '#0D483F',
        zIndex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8)
    },
    doc_type_text: {
        fontSize: scale(14),
        fontFamily: 'Aeonik-Medium',
        color: 'white',
        padding: scale(2)
    },
    fallbackTitle: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        color: 'black',
        marginRight: "auto"
    },
    fallbackDate: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(13),
        color: '#8A8A7C',
        marginRight: "auto"
    }
})

export default OneDocument