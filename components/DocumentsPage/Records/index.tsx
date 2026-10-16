import { GetSummaryRecords } from "@/db/Record";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect } from 'react';
import { View } from "react-native";

const Records: React.FC = () => {
    const db = useSQLiteContext();

    async function fetchRecords() {
        const result = await GetSummaryRecords(db);
        console.log("Fetched records:", result);
    }

    useEffect(() => {
        fetchRecords();
    }, [db])

    return (
        <View></View>
    )
}

export default Records