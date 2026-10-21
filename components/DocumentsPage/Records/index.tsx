import { GetSummaryRecords } from "@/db/Record";
import { RecordSummaryWithDocuments } from "@/types";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { Animated, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from "react-native";
import Record from "./Record";


type Props = {
    navbarHeight: number;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    SetCurrentDate: React.Dispatch<React.SetStateAction<string>>;
    CurrentDate: string;
};

const Records: React.FC<Props> = ({ SetCurrentDate, CurrentDate, navbarHeight, onScroll }) => {
    const [records, setRecords] = useState<RecordSummaryWithDocuments[]>([]);
    const db = useSQLiteContext();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    const rows = await GetSummaryRecords(db);
                    setRecords(rows);
                } catch (e) {
                    console.error("Failed to fetch records:", e);
                }
            })();
        }, [db])
    );

    const AnimatedFlatList =
        Animated.createAnimatedComponent(FlatList<RecordSummaryWithDocuments>);

    return (
        <AnimatedFlatList
            data={records}
            onScroll={onScroll}
            keyExtractor={(r) => String(r.Id)}
            renderItem={({ item }) =>
                <Record record={item} />
            }
            contentContainerStyle={{
                paddingTop: navbarHeight,
                gap: vScale(20),
                paddingBottom: vScale(180),
            }}
        />
    );
};

const styles = StyleSheet.create({
    Container: {
    }
})

export default Records;