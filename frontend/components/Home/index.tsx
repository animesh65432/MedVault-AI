import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, StyleSheet } from "react-native"
import { MedicalDocument, StatsInformation } from "@/types"
import { GetDocs } from "@/api/docs"
import Error from '../Error'
import NonEmptyStats from './NonEmptyStats'
import Title from './Title'
import Stats from './Stats'
import { User } from '@/context/User'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import EmptyStats from './EmptyStats'
import { GetStats } from '@/api/stats'
import TopLoadingBar from '../TopLoadingBar'
import { DocumentListSkeleton, StatsSkeleton } from './Skeleton'

const HomeLayOut = () => {
    const { token, name } = useContext(User);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [documents, setDocuments] = useState<MedicalDocument[]>([]);
    const [statsInformation, setStatsInformation] = useState<StatsInformation | null>(null);


    const showStats = statsInformation !== null && (
        statsInformation.total_documents > 0 ||
        statsInformation.total_medicine_records > 0 ||
        statsInformation.total_reminders > 0
    );

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);

        try {
            const [statsResponse, docsResponse] = await Promise.all([
                GetStats(token) as Promise<StatsInformation>,
                GetDocs(token) as Promise<MedicalDocument[]>,
            ]);

            setStatsInformation(statsResponse);
            setDocuments(docsResponse);
        } catch (error) {
            console.error("Error fetching home data:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);



    if (hasError) {
        return (
            <Error
                fetchData={fetchData}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Title
                userName={name}
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
                            <Stats statsInformation={statsInformation} />
                            <NonEmptyStats documents={documents} />
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
        gap: vScale(24),
    }
})

export default HomeLayOut