import { GetRecords } from "@/db/Record";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect } from 'react';
import { View } from "react-native";

const Records: React.FC = () => {
    const db = useSQLiteContext();

    async function fetchRecords() {
        const records = await GetRecords(db, "DESC", 20, 0)
        console.log("Fetched Records:", records)
    }

    useEffect(() => {
        fetchRecords();
    }, [db])

    return (
        <View></View>
    )
}

export default Records