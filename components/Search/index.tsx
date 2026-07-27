import { GetDocuments, GetSearchSuggestions, HasAnyDocuments } from "@/db/document";
import { DocumentRow, SearchSuggestion } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import ChatBotAI from "../ChatBotAI";
import Empty from './Empty';
import Input from './Input';
import NonEmpty from "./NonEmpty";
import Filters from "./NonEmpty/Filters";
import RecentSearch from "./RecentSearch";
import Suggestions from "./Suggestions";
import Title from "./Title";

const PAGE_SIZE = 10

const Search: React.FC = () => {
    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isLoadingMoreRef = useRef(false)
    const [SelectedCategories, setSelectedCategories] = useState<string[]>(["All Records"])
    const [SelectedDate, setSelectedDate] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    })
    const [SearchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
    const [hasAnyDocuments, setHasAnyDocuments] = useState<boolean | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
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
            const CateGories = SelectedCategories.filter(category => category !== "All Records")
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, CateGories, SelectedDate)

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
            const CateGories = SelectedCategories.filter(category => category !== "All Records")
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, CateGories, SelectedDate)
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
        }, [SelectedCategories, SelectedDate])
    );

    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            setSearchSuggestions([])
            return
        }

        let cancelled = false

        const timeout = setTimeout(async () => {
            try {
                const search_documents = await GetSearchSuggestions(db, searchQuery)
                if (!cancelled) {
                    setSearchSuggestions(search_documents)
                }
            } catch (error) {
                console.log("Failed to fetch search documents:", error)
            }
        }, 300)

        return () => {
            cancelled = true
            clearTimeout(timeout)
        }
    }, [searchQuery])

    const FilterCateGories = SelectedCategories.filter(category => category !== "All Records")
    const hasQuery = searchQuery.trim().length > 0 || FilterCateGories.length > 0 || SelectedDate.startDate !== null || SelectedDate.endDate !== null;
    const IsSearchIng = searchQuery.trim().length > 0;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) {
            loadMore()
        }
    }


    return (
        <View style={styles.wrapper}>
            <View style={styles.InputWrapper}>
                <Input
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </View>
            {searchQuery.trim().length !== 0 &&
                <RecentSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            }
            {
                searchQuery.trim().length > 0 &&
                <Title
                    searchQuery={searchQuery}
                    SearchSuggestionsLength={SearchSuggestions.length}
                />
            }

            {IsSearchIng
                && <Suggestions
                    SearchSuggestions={SearchSuggestions}
                />
            }
            {!IsSearchIng &&
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={true}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {hasAnyDocuments &&
                        <Filters
                            SelectedCategories={SelectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            SelectedDate={SelectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    }
                    {documents.length === 0 ? (
                        <Empty
                            hasQuery={hasQuery}
                        />
                    ) : (
                        <NonEmpty
                            documents={documents}
                            isLoading={isLoading}
                            isLoadingMore={isLoadingMoreRef.current}
                        />
                    )}
                </ScrollView>
            }
            {documents.length === 0 || !IsSearchIng &&
                <ChatBotAI
                    currentDocument="false"
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: vScale(45),
    },
    container: {
        flex: 1,
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