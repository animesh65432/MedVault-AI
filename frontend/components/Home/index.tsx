import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet } from "react-native"
import { MedicalDocument, StatsInformation } from "@/types"
import { GetDocs } from "@/api/docs"
import Title from './Title'
import Stats from './Stats'
import { User } from '@/context/User'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import EmptyStats from './EmptyStats'
import { GetStats } from '@/api/stats'

const HomeLayOut = () => {
    const { token, name } = useContext(User);

    const [showStats, setShowStats] = useState(false);

    const [statsInformation, setStatsInformation] =
        useState<StatsInformation | null>(null);

    const FetchStats = async () => {
        try {
            const response = await GetStats(token) as StatsInformation;

            setStatsInformation(response);

        } catch (error) {
            console.log("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        FetchStats();
    }, []);

    useEffect(() => {
        if (!statsInformation) return;

        const isEmpty =
            statsInformation.total_documents === 0 &&
            statsInformation.total_medicine_records === 0 &&
            statsInformation.total_reminders === 0;

        setShowStats(!isEmpty);

    }, [statsInformation]);
    return (
        <View style={styles.container}>
            <Title
                userName={name}
                ShowStats={showStats}
            />
            {showStats && statsInformation && (
                <Stats
                    statsInformation={statsInformation}
                />
            )}
            {!showStats && (
                <EmptyStats />
            )}

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: vScale(40),
        paddingBottom: vScale(32),
        gap: vScale(24),
    }
})

export default HomeLayOut