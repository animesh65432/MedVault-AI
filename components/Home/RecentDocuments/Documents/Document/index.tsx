import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from "expo-router"
import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome"

type Props = {
    document: DocumentRow
}

const Document: React.FC<Props> = ({ document }) => {
    const router = useRouter()
    const { thumbUri, thumbFailed } = usePdfThumbnail(document.SourceFilePath)
    const [loadError, setLoadError] = useState(false)

    const hasImage = document.IsPdf
        ? (!thumbFailed && !!thumbUri && !loadError)
        : (!!document.SourceFilePath && !loadError)

    const source = document.IsPdf ? thumbUri : document.SourceFilePath

    const content = (
        <>
            <View style={[styles.doc_type_container, { backgroundColor: "#0D483F" }]}>
                <Text style={styles.doc_type_text}>{document.type}</Text>
            </View>
            <Text style={styles.title}>{document.title}</Text>
            <Text style={styles.date}>{document.date}</Text>
        </>
    )

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
                    resizeMode="stretch"
                    onError={() => setLoadError(true)}
                >
                    <View style={styles.overlay} />
                    {content}
                </ImageBackground>
            ) : (
                <View style={[styles.tile, styles.fallback]}>
                    <FontAwesome
                        name="file-pdf-o"
                        size={scale(40)}
                        color="#0D483F"
                    />
                    <View style={[styles.doc_type_container]}>
                        <Text style={styles.doc_type_text}>{document.type}</Text>
                    </View>
                    <Text style={styles.FallbackText}>{document.title}</Text>
                    <Text style={styles.FallbackDate}>{document.date}</Text>
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
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: scale(10),
        width: scale(180),
        height: vScale(240),
    },
    tileImage: {
        borderRadius: 10
    },
    fallback: {
        alignItems: 'center',
        backgroundColor: '#F4F3F1',
        borderWidth: 1,
        borderColor: '#E4E2DE',
        paddingVertical: vScale(16),
        paddingHorizontal: scale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderRadius: 10,
    },
    badge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 9,
        fontFamily: 'Aeonik-Medium',
    },
    overlay: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
    },
    title: {
        fontSize: scale(13),
        fontFamily: 'Aeonik-Medium',
        color: '#FFFFFF',
        marginBottom: vScale(4),
        textAlign: 'center',
    },
    date: {
        fontSize: scale(13),
        fontFamily: 'Aeonik-Medium',
        color: '#FFFFFF',
        opacity: 0.8,
        textAlign: 'center',
        marginLeft: "auto",
        marginTop: vScale(4),
    },
    doc_type_container: {
        position: 'absolute',
        top: 4,
        left: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 6,
        backgroundColor: '#0D483F',
    },
    doc_type_text: {
        fontSize: scale(14),
        fontFamily: 'Aeonik-Medium',
        color: 'white',
        padding: scale(2)
    },
    FallbackText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(13),
        color: '#686864',
        textAlign: 'center',
        marginTop: vScale(48),
    },
    FallbackDate: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(11),
        color: '#8A8A7C',
        textAlign: 'center',
    }
})

export default Document