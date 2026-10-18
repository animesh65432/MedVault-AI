import { usePdfThumbnail } from "@/hooks/usePdfThumbnail";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
    document: DocumentRow;
    IsPdf: boolean;
    size: number;
};

const RecordImage: React.FC<Props> = ({ document, IsPdf, size = scale(70) }) => {
    const { thumbUri, thumbFailed } = usePdfThumbnail(document.SourceFilePath, IsPdf);
    const uri = IsPdf ? thumbUri : document.SourceFilePath;
    const showFallback = !uri || (IsPdf && thumbFailed)
    return (
        <View style={[style.Box, { width: size, height: size }]}>
            {showFallback ? (
                <Ionicons
                    name={IsPdf ? "document-text-outline" : "image-outline"}
                    size={size * 0.4}
                    color="#9AA0A6"
                />
            ) : (
                <Image source={{ uri: uri! }} style={style.Img} resizeMode="cover" />
            )}
        </View>
    );
};

const style = StyleSheet.create({
    Box: {
        borderRadius: scale(8),
        backgroundColor: "#F1F3F4",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    Img: {
        width: "100%",
        height: "100%",
    },
});

export default RecordImage;