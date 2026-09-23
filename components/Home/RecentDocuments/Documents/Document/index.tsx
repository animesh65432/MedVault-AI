import { usePdfThumbnail } from "@/hooks/usePdfThumbnail"
import { DocumentRow } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useRouter } from "expo-router"
import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
                    {content}
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
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: scale(14),
        fontFamily: 'Aeonik-Regular',
        color: '#FFFFFF',
        marginBottom: vScale(4),
        textAlign: 'center',
    },
    date: {
        fontSize: scale(11),
        fontFamily: 'Aeonik-Regular',
        color: '#FFFFFF',
        opacity: 0.8,
        textAlign: 'center',
    },
})

export default Document