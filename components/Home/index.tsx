import { GetDocs } from "@/api/docs"
import { GetStats } from '@/api/stats'
import { DocumentsContext } from "@/context/Documents"
import { MedicalDocument, StatsInformation } from "@/types"
import { scale } from '@/utils/scale'
import { token, UserName } from "@/utils/token"
import { vScale } from '@/utils/vScale'
import React, { useCallback, useContext, useState } from 'react'
import { StyleSheet, View } from "react-native"
import Error from '../Error'
import EmptyStats from './EmptyStats'
import NonEmptyStats from './NonEmptyStats'
import { DocumentListSkeleton, StatsSkeleton } from './Skeleton'
import Stats from './Stats'
import Title from './Title'

const HomeLayOut = () => {
    const { Documents, SetDocuments } = useContext(DocumentsContext);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
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
            SetDocuments(docsResponse);
        } catch (error) {
            console.error("Error fetching home data:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [token]);


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
                userName={UserName}
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
                            <NonEmptyStats documents={Documents} />
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