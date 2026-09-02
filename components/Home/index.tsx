import { GetRemindersCount } from "@/db/alerts";
import { GetDocumentsCount } from "@/db/document";
import { GetMedicinesCount } from "@/db/medicines";
import { CountTypes } from "@/types";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from "react-native";
import EmptyStats from "./EmptyStats";
import NonEmptyStats from "./NonEmptyStats";


const HomeLayOut = () => {
    const db = useSQLiteContext()
    const [counts, setCounts] = useState<CountTypes>({
        documentsCount: 0,
        medicinesCount: 0,
        remindersCount: 0,
    });

    async function fetchCounts() {
        try {
            const [documentsCount, medicinesCount, remindersCount] = await Promise.all([
                GetDocumentsCount(db),
                GetMedicinesCount(db),
                GetRemindersCount(db),
            ]);
            setCounts({
                documentsCount,
                medicinesCount,
                remindersCount,
            });

        } catch (error) {
            console.error("Failed to fetch counts:", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchCounts();
            return () => {
                fetchCounts();
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            {counts.documentsCount > 0 ?
                <NonEmptyStats
                    documentsCount={counts.documentsCount}
                    medicinesCount={counts.medicinesCount}
                    remindersCount={counts.remindersCount}
                />
                :
                <EmptyStats />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default HomeLayOut