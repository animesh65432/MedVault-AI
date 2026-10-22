import { GetRecordById } from "@/db/Record";
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const RecordPage: React.FC = () => {
    const db = useSQLiteContext();
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const { id } = useLocalSearchParams();

    async function fetchRecordDetails() {
        SetIsLoading(true);
        if (typeof id !== 'string') {
            console.error("Invalid medicine ID:", id);
            return;
        }
        let Id = Number(id);
        try {
            await GetRecordById(db, Id);
        }
        catch (error) {
            console.log("Failed to fetch medicine details:", error);
        }
        finally {
            SetIsLoading(false);
        }

    }

    useEffect(() => {
        fetchRecordDetails()
    }, [id])
    return (
        <View></View>
    )
}

export default RecordPage