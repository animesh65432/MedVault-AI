import { GetRemindersCount } from "@/db/alerts";
import { scale } from "@/utils/scale";
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Hero from "./Hero";
import Navbar from './Navbar';
import Title from './Title';

const AlertsComponent: React.FC = () => {
    const db = useSQLiteContext();
    const [AlertsCount, setAlertsCount] = useState(0);

    async function fetchAlertsCount() {
        try {
            const remindersCount = await GetRemindersCount(db);
            setAlertsCount(remindersCount);
        } catch (error) {
            console.error("Failed to fetch alerts count:", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchAlertsCount();
            return () => {
                fetchAlertsCount();
            };
        }, [])
    );

    const onAddPress = () => { }

    return (
        <View style={styles.container}>
            <Navbar />
            <Title
                Count={AlertsCount}
                onAddPress={onAddPress}
            />
            <Hero />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: scale(10)
    }
})

export default AlertsComponent