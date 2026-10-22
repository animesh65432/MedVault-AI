import { RecordSummaryWithDocuments } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Thumabnail from "./Thumbnail";

type Props = {
    record: RecordSummaryWithDocuments;
};

const Record: React.FC<Props> = ({ record }) => {
    const router = useRouter()
    return (
        <TouchableOpacity
            style={style.RecordContainer}
            onPress={() => router.push(`/RecordDetails/${record.Id}`)}
        >
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
        </TouchableOpacity >
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
        gap: scale(7)
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