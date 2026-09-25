import Documents from "@/components/Documents";
import { GetDocuments, HasAnyDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';


const PAGE_SIZE = 10

const Search: React.FC = () => {
    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isLoadingMoreRef = useRef(false)
    const [SelectedDate, setSelectedDate] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    })
    const [hasAnyDocuments, setHasAnyDocuments] = useState<boolean | null>(null)
    const [documents, setdocuments] = useState<DocumentRow[]>([])
    const db = useSQLiteContext()

    async function fetchDocuments(reset: boolean) {
        if (reset) {
            setIsLoading(true)
        }
        else {
            isLoadingMoreRef.current = true
        }

        try {
            const targetPage = reset ? 1 : page
            const offset = (targetPage - 1) * PAGE_SIZE
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, [], SelectedDate)

            setdocuments(prev => reset ? rows : [...prev, ...rows])
            setHasMore(rows.length === PAGE_SIZE)
            if (reset) setPage(1)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        }
        finally {
            if (reset) {
                setIsLoading(false)
            }
            else {
                isLoadingMoreRef.current = false
            }
        }
    }

    async function loadMore() {
        if (!hasMore || isLoadingMoreRef.current) return
        isLoadingMoreRef.current = true
        const nextPage = page + 1
        try {
            const offset = (nextPage - 1) * PAGE_SIZE
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, [], SelectedDate)
            setdocuments(prev => [...prev, ...rows])
            setHasMore(rows.length === PAGE_SIZE)
            setPage(nextPage)
        } catch (error) {
            console.error("Failed to load more documents:", error)
        } finally {
            isLoadingMoreRef.current = false
        }
    }

    async function fetchHasAnyDocuments() {
        try {
            const result = await HasAnyDocuments(db)
            setHasAnyDocuments(result)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchHasAnyDocuments();
            const timeout = setTimeout(() => fetchDocuments(true), 300)
            return () => clearTimeout(timeout)
        }, [SelectedDate])
    );

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) {
            loadMore()
        }
    }


    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.wrapper}
                onScroll={handleScroll}
            >
                <Documents
                    documents={documents}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingTop: vScale(40),
        paddingHorizontal: scale(20),
        display: "flex",
        flexDirection: "column",
        gap: vScale(14)
    },
    content: {
        flexDirection: "column",
        gap: vScale(14),
        paddingBottom: vScale(32),
        paddingTop: vScale(10),
        paddingHorizontal: scale(20),
    },
    InputWrapper: {
        paddingHorizontal: scale(20),
    }
})

export default Search