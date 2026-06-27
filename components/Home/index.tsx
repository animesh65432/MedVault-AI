import { StatsInformation } from "@/types"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React, { useState } from 'react'
import { StyleSheet, View } from "react-native"
import EmptyStats from './EmptyStats'
import { DocumentListSkeleton, StatsSkeleton } from './Skeleton'
import Stats from './Stats'
import Title from './Title'

const HomeLayOut = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statsInformation, setStatsInformation] = useState<StatsInformation | null>(null);

    const showStats = statsInformation !== null && (
        statsInformation.total_documents > 0 ||
        statsInformation.total_medicine_records > 0 ||
        statsInformation.total_reminders > 0
    );

    return (
        <View style={styles.container}>
            <Title
                ShowStats={showStats}
            />
            {isLoading ? (
                <>
                    <StatsSkeleton />
                    <DocumentListSkeleton count={4} />
                </>
            ) : (
                <>
                    {showStats && statsInformation && (
                        <>
                            <Stats
                                statsInformation={statsInformation}
                            />
                            {/* <NonEmptyStats documents={Documents} /> */}
                        </>
                    )}
                    {!showStats && <EmptyStats />}
                </>
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
        gap: vScale(10),
    }
})

export default HomeLayOut