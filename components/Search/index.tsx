import { COLORS } from "@/app/(tabs)/_layout";
import { GetDocuments, GetSearchSuggestions, delete_documents } from "@/db/document";
import { DocumentRow, SearchSuggestion } from "@/types";
import { scale } from "@/utils/scale";
import { shareDocuments } from "@/utils/shareDocuments";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import BelowNavbar from "../DocumentsPage/BelowNavbar";
import Input from './Input';
import NonEmpty from "./NonEmpty";
import Filters from "./NonEmpty/Filters";
import RecentSearch from "./RecentSearch";
import Suggestions from "./Suggestions";
import Title from "./Title";

const PAGE_SIZE = 10

type Props = {
    showResults: boolean
}

const Search: React.FC<Props> = ({ showResults }) => {
    const { types } = useLocalSearchParams();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const Types = useMemo(() => (types ? JSON.parse(types as string) : []), [types]);
    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isLoadingMoreRef = useRef(false)
    const [SelectedCategories, setSelectedCategories] = useState<string[]>([])
    const [SelectedDate, setSelectedDate] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    })
    const [SearchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [documents, setdocuments] = useState<DocumentRow[]>([])
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const selectionMode = selectedIds.length > 0;

    async function fetchDocuments(reset: boolean) {
        if (SelectedCategories.length === 0 && SelectedDate.startDate === null && SelectedDate.endDate === null && !showResults) {
            console.log("No query, skipping fetchDocuments", SelectedCategories.length === 0)
            return;
        }
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
        if (!hasMore || isLoadingMoreRef.current || !showResults) return
        isLoadingMoreRef.current = true
        const nextPage = page + 1
        try {
            const offset = (nextPage - 1) * PAGE_SIZE
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, SelectedCategories, SelectedDate)
            setdocuments(prev => [...prev, ...rows])
            setHasMore(rows.length === PAGE_SIZE)
            setPage(nextPage)
        } catch (error) {
            console.error("Failed to load more documents:", error)
        } finally {
            isLoadingMoreRef.current = false
        }
    }

    useFocusEffect(
        useCallback(() => {
            const timeout = setTimeout(() => fetchDocuments(true), 300)
            return () => clearTimeout(timeout)
        }, [SelectedCategories, SelectedDate])
    );

    useEffect(() => {
        if (searchQuery.trim().length === 0 && !showResults) {
            setSearchSuggestions([])
            return
        }

        let cancelled = false

        const timeout = setTimeout(async () => {
            if (cancelled) return

            try {
                const results = await GetSearchSuggestions(db, searchQuery)
                if (!cancelled) {
                    setSearchSuggestions(results)
                }
            } catch (error) {
                console.log("Failed to fetch search documents:", error)
            }
        }, 300)

        return () => {
            cancelled = true
            clearTimeout(timeout)
        }
    }, [searchQuery, db])

    useEffect(() => {
        if (Types.length > 0) {
            setSelectedCategories(Types);
        }
    }, [Types])

    useEffect(() => {
        if (SelectedCategories.length === 0 && SelectedDate.startDate === null && SelectedDate.endDate === null) {
            setdocuments([])
            return;
        }
    }, [SelectedCategories, SelectedDate])

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: selectionMode
                ? { display: "none" }
                : styles.tabBar,
        });

        return () => {
            navigation.setOptions({
                tabBarStyle: styles.tabBar,
            });
        }
    }, [selectionMode]);

    const IsSearchIng = searchQuery.trim().length > 0;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) {
            loadMore()
        }
    }
    const handleShare = async () => {
        const selected = documents.filter((d) => selectedIds.includes(d.Id))
        await shareDocuments(selected)
    }

    const handleDelete = async () => {
        delete_documents(db, selectedIds)
        setSelectedIds([])
        fetchDocuments(true)
    }

    console.log("SelectedCategories", SelectedCategories)


    return (
        <View style={styles.wrapper}>
            <View style={styles.InputWrapper}>
                <Input
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    showResults={showResults}
                />
            </View>
            {showResults &&
                <RecentSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            }

            {
                searchQuery.trim().length > 0 && showResults &&
                <Title
                    searchQuery={searchQuery}
                    SearchSuggestionsLength={SearchSuggestions.length}
                />
            }

            {IsSearchIng
                && showResults && <Suggestions
                    SearchSuggestions={SearchSuggestions}
                />
            }

            <View
                style={styles.content}
            >
                {showResults &&
                    <>
                        {!IsSearchIng &&
                            <Filters
                                showResults={showResults}
                                SelectedCategories={SelectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                SelectedDate={SelectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                        }
                    </>
                }

                {!showResults &&
                    <Filters
                        showResults={showResults}
                        SelectedCategories={SelectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        SelectedDate={SelectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                }


                {documents.length !== 0 && showResults &&
                    <NonEmpty
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        documents={documents}
                        isLoading={isLoading}
                        isLoadingMore={isLoadingMoreRef.current}
                        onScroll={handleScroll}
                    />
                }
            </View>
            {showResults && selectionMode &&
                <BelowNavbar
                    count={selectedIds.length}
                    onClose={() => setSelectedIds([])}
                    onShare={handleShare}
                    onDelete={handleDelete}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: vScale(45),
        backgroundColor: "white"
    },
    content: {
        flex: 1,
        flexDirection: "column",
        gap: vScale(14),
        paddingBottom: vScale(32),
        paddingTop: vScale(10),
        paddingHorizontal: scale(20),
    },
    InputWrapper: {
        paddingHorizontal: scale(20),
    },
    tabBar: {
        position: 'absolute',
        height: vScale(75),
        paddingTop: vScale(10),
        paddingBottom: vScale(10),
        width: '70%',
        bottom: vScale(80),
        alignSelf: 'center',
        borderRadius: scale(50),
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        elevation: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: scale(55),
    }
})

export default Search