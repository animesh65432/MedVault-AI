import { GetSummaryRecords } from "@/db/Record";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { FlatList } from "react-native";
import Record from "./Record";

type Props = {
    navbarHeight: number
};

const Records: React.FC<Props> = ({ navbarHeight }) => {
    const [records, setRecords] = useState([]);
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

    console.log("records", records);

    return (
        <FlatList
            data={records}
            keyExtractor={(r) => String("")}
            renderItem={({ item }) =>
                <Record record={item} />
            }
            contentContainerStyle={{
                paddingTop: navbarHeight,
                gap: vScale(20),
            }}
        />
    );
};

export default Records;