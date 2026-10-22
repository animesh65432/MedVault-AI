import { usePdfThumbnail } from "@/hooks/usePdfThumbnail";
import { DocumentRow } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
    document: DocumentRow;
    IsPdf: boolean;
    size: number;
    radius?: number;
};

const RecordImage: React.FC<Props> = ({ document: doc, IsPdf, size, radius = 8 }) => {
    const { thumbUri, thumbFailed } = usePdfThumbnail(doc.SourceFilePath, IsPdf);
    const uri = IsPdf ? thumbUri : doc.SourceFilePath;
    const showFallback = !uri || (IsPdf && thumbFailed);

    return (
        <View
            style={[
                style.Box,
                {
                    width: size,
                    height: size,
                    borderRadius: radius,
                    backgroundColor: IsPdf ? "#23423B" : "#E8F0FE",
                },
            ]}
        >
            {showFallback ? (
                <Ionicons
                    name={IsPdf ? "document-text" : "image"}
                    size={size * 0.5}
                    color={"#D9F99D"}
                />
            ) : (
                <Image source={{ uri: uri! }} style={style.Img} resizeMode="cover" />
            )}
        </View>
    );
};

const style = StyleSheet.create({
    Box: {
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