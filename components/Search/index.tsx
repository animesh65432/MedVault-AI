import { GetDocuments, GetSearchSuggestions, HasAnyDocuments } from "@/db/document";
import { DocumentRow, SearchSuggestion } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Empty from './Empty';
import Input from './Input';
import NonEmpty from "./NonEmpty";
import Filters from "./NonEmpty/Filters";
import Suggestions from "./Suggestions";


const Search: React.FC = () => {
    const [SelectedCategories, setSelectedCategories] = useState<string[]>([])
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

    async function fetchDocuments() {
        try {
            const documents = await GetDocuments(db, "ASC", 10, SelectedCategories, SelectedDate)
            setdocuments(documents)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        }
    }

    async function fetchHasAnyDocuments() {
        try {
            const hasAnyDocuments = await HasAnyDocuments(db)
            setHasAnyDocuments(hasAnyDocuments)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchDocuments()
        }, 300)

        return () => clearTimeout(timeout)
    }, [SelectedCategories, SelectedDate])

    useFocusEffect(
        React.useCallback(() => {
            fetchDocuments()
            fetchHasAnyDocuments()
        }, [])
    )

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

    const hasQuery = searchQuery.trim().length > 0 || SelectedCategories.length > 0 || SelectedDate.startDate !== null || SelectedDate.endDate !== null;
    const IsSearchIng = searchQuery.trim().length > 0;

    return (
        <View style={styles.wrapper}>
            <View
                style={styles.InputWrapper}
            >
                <Input
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </View>
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
                        <Empty hasQuery={hasQuery} />
                    ) : (
                        <NonEmpty
                            hasQuery={hasQuery}
                            documents={documents}
                            SelectedCategories={SelectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            SelectedDate={SelectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    )}
                </ScrollView>
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
        paddingTop: vScale(14),
        paddingHorizontal: scale(20),
    },
    InputWrapper: {
        paddingHorizontal: scale(20),
    }
})

export default Search