import { RecordTypes } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    record: RecordTypes;
};

const Record: React.FC<Props> = ({ record }) => {
    return (
        <View style={style.RecordContainer}>
            <View style={style.Thumbs}>
                {/* {
                    record.documents &&
                    record.documents.length > 0 &&
                    record.documents.map((doc) =>
                        <RecordImage
                            key={doc.Id}
                            document={doc}
                            IsPdf={doc.IsPdf}
                            size={scale(70)}
                        />
                    )
                } */}
            </View>
            <Text style={style.Name}>
                {record.Name}
            </Text>
        </View>
    );
};

const style = StyleSheet.create({
    RecordContainer: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        elevation: 2,
        backgroundColor: "white",
        borderRadius: scale(5),
        padding: scale(10),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        marginBottom: scale(10),
    },
    Thumbs: {
        flexDirection: "row",
        gap: scale(8),
        marginBottom: scale(4),
    },
    More: {
        width: scale(70),
        height: scale(70),
        borderRadius: scale(8),
        backgroundColor: "#E8F0FE",
        alignItems: "center",
        justifyContent: "center",
    },
    MoreText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(16),
        color: "#1A73E8",
    },
    Name: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(18),
        color: "black",
    },
    Meta: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(12),
        color: "#6B7280",
    },
});

export default Record;