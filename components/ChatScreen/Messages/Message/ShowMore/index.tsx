import { TypeOfDocumenet } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RedirectToTable } from "./utils";

type Props = {
    Types: TypeOfDocumenet[];
    tableName: string;
};

const ShowMore: React.FC<Props> = ({ Types, tableName }) => {
    const handleRedirect = () => {
        router.push({
            pathname: RedirectToTable(tableName),
            params: Types.length > 0 ? { types: JSON.stringify(Types) } : undefined,
        });
    };

    return (
        <View style={style.wrapper}>
            <Pressable
                onPress={handleRedirect}
                style={({ pressed }) => [
                    style.pill,
                    pressed && style.pillPressed,
                ]}
            >
                <Text style={style.label}>Show more</Text>
                <View style={style.iconCircle}>
                    <Feather name="arrow-right" size={scale(12)} color="#FAFAF8" />
                </View>
            </Pressable>
        </View>
    );
};

const style = StyleSheet.create({
    wrapper: {
        marginTop: vScale(12),
        alignItems: "flex-end",
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
        backgroundColor: "#EEF6A2",
        borderRadius: scale(20),
        paddingLeft: scale(14),
        paddingRight: scale(4),
        paddingVertical: vScale(4),
    },
    pillPressed: {
        opacity: 0.7,
    },
    label: {
        color: "#0D1F1C",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(13),
    },
    iconCircle: {
        width: scale(26),
        height: scale(26),
        borderRadius: scale(13),
        backgroundColor: "#234338",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default ShowMore;