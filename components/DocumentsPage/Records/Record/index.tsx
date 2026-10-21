import { RecordSummaryWithDocuments } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Thumabnail from "./Thumbnail";

type Props = {
    record: RecordSummaryWithDocuments;
};

const Record: React.FC<Props> = ({ record }) => {
    return (
        <View style={style.RecordContainer}>
            <View style={style.RecordTop}>
                <View style={style.Thumbs}>
                    <Thumabnail
                        docs={record.documents}
                    />
                </View>
                <Text
                    style={style.Name}
                    numberOfLines={2}
                >
                    {record.Name}
                </Text>
            </View>
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
        borderRadius: scale(40),
        padding: scale(8),
        display: "flex",
        flexDirection: "column",
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
        fontSize: fs(17),
        color: "black",
    },
    Meta: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(12),
        color: "#6B7280",
    },
    RecordTop: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(15)
    },
    date: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        color: "#6B7280",
        marginBottom: scale(4),
        marginLeft: "auto",
        marginRight: scale(10)
    }
});

export default Record;