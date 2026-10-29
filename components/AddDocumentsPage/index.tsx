import { SelectedDocumentsContext } from "@/context/SelectedDocuments"
import { GetDocumentById, GetDocuments, GetSearchByKeyword } from "@/db/document"
import { GetRecordDocumentIds } from "@/db/Record"
import { DocumentRow, TypeOfDocumenet } from "@/types"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useSQLiteContext } from "expo-sqlite"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import Documents from "./Documents"
import Filter from "./Filter"
import Navbar from "./Navbar"

export type selectedType = TypeOfDocumenet | "All Types"

const PAGE_SIZE = 20;

type Props = {
    searchQuery: string | null;
    startDate: string | null;
    endDate: string | null;
    SelectedCategoried: TypeOfDocumenet | null;
    recordId: string;
}

const AddDocumentsPage: React.FC<Props> = ({ searchQuery, startDate, endDate, SelectedCategoried, recordId }) => {
    const db = useSQLiteContext();
    const [category, setCategory] = useState<TypeOfDocumenet | null>(null);
    const [LastSelectedDocument, setLastSelectedDocument] = useState<DocumentRow | null>(null);
    const [input, setInput] = useState<string | null>(null);
    const [dates, setDates] = useState({
        startDate: null as Date | null,
        endDate: null as Date | null,
    });
    const scrollY = useRef(new Animated.Value(0)).current;
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [filterHeight, setFilterHeight] = useState(0);
    const { SelectedDocumentsIds, setSelectedDocumentsIds } = useContext(SelectedDocumentsContext);
    const [documents, setdocuments] = useState<DocumentRow[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const pageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const isLoadingMoreRef = useRef(false);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (SelectedCategoried) setCategory(SelectedCategoried);
    }, [SelectedCategoried]);

    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            setInput(searchQuery);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (startDate && endDate) {
            setDates({ startDate: new Date(startDate), endDate: new Date(endDate) });
        }
    }, [startDate, endDate]);

    const load = useCallback(async (reset: boolean) => {
        if (!reset && (!hasMoreRef.current || isLoadingMoreRef.current)) return;

        const requestId = ++requestIdRef.current;
        const page = reset ? 0 : pageRef.current;
        const types: selectedType[] = category === null ? [] : [category];

        if (reset) {
            isLoadingMoreRef.current = false;
            setIsLoadingMore(false);
        } else {
            isLoadingMoreRef.current = true;
            setIsLoadingMore(true);
        }

        let rows: DocumentRow[] = [];

        try {
            if (input && input.trim().length > 0) {
                rows = await GetSearchByKeyword(
                    db,
                    input.trim(),
                    "DESC",
                    PAGE_SIZE,
                    page * PAGE_SIZE,
                    "Documents"
                );
            }
            else {
                rows = await GetDocuments(
                    db,
                    "DESC",
                    PAGE_SIZE,
                    page * PAGE_SIZE,
                    types,
                    dates
                );
            }

            if (requestId !== requestIdRef.current) return;

            setdocuments(prev => (reset ? rows : [...prev, ...rows]));
            pageRef.current = page + 1;
            hasMoreRef.current = rows.length === PAGE_SIZE;
        } catch (error) {
            console.error("Failed to load documents:", error);
        } finally {
            if (requestId === requestIdRef.current) {
                isLoadingMoreRef.current = false;
                setIsLoadingMore(false);
            }
        }
    }, [db, category, dates, input]);

    async function RecordsDocumentsCount() {
        try {
            if (!recordId || SelectedDocumentsIds.length > 0) {
                return;
            }
            const defaultSelectedDocumentIds = await GetRecordDocumentIds(db, recordId);
            setSelectedDocumentsIds(defaultSelectedDocumentIds);
        } catch (error) {
            console.error("Failed to get document count by recordId:", error);
        }
    };

    async function GetLastDocument() {
        if (SelectedDocumentsIds.length === 0) {
            setLastSelectedDocument(null);
            return;
        }
        const Document = await GetDocumentById(db, SelectedDocumentsIds[SelectedDocumentsIds.length - 1])
        setLastSelectedDocument(Document)
    }

    useEffect(() => {
        scrollY.setValue(0);
        load(true);
    }, [load]);

    useEffect(() => {
        GetLastDocument();
    }, [SelectedDocumentsIds])

    useEffect(() => {
        RecordsDocumentsCount();
    }, [recordId]);

    const loadMore = useCallback(() => load(false), [load]);

    const onScroll = useMemo(
        () =>
            Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                useNativeDriver: true,
            }),
        [scrollY]
    );

    const filterOffset = useMemo(
        () => Animated.diffClamp(scrollY, 0, Math.max(filterHeight, 1)),
        [scrollY, filterHeight]
    );

    const translateY = useMemo(
        () => Animated.multiply(filterOffset, -1),
        [filterOffset]
    );

    const filterOpacity = useMemo(
        () =>
            filterOffset.interpolate({
                inputRange: [0, Math.max(filterHeight, 1)],
                outputRange: [1, 0],
                extrapolate: "clamp",
            }),
        [filterOffset, filterHeight]
    );

    return (
        <View style={styles.container}>
            <View
                style={styles.navbarWrapper}
                onLayout={(e) => setNavbarHeight(e.nativeEvent.layout.height)}
            >
                <Navbar
                    LasSelectedDocument={LastSelectedDocument}
                    DocumentsCount={SelectedDocumentsIds.length}
                />
            </View>
            <Animated.View
                style={[
                    styles.FilterWrapper,
                    {
                        top: navbarHeight,
                        opacity: filterOpacity,
                        transform: [{ translateY }],
                    },
                ]}
                onLayout={(e) => {
                    if (filterHeight === 0) setFilterHeight(e.nativeEvent.layout.height);
                }}
            >
                <Filter
                    searchQuery={input}
                    startDate={dates.startDate ? dates.startDate.toISOString() : null}
                    endDate={dates.endDate ? dates.endDate.toISOString() : null}
                    SelectedCategoried={category}
                    setCategory={setCategory}
                    setDates={setDates}
                    setInput={setInput}
                />
            </Animated.View>
            <Documents
                documents={documents}
                onScroll={onScroll}
                isLoadingMore={isLoadingMore}
                NavbarHeight={navbarHeight + filterHeight + 10}
                onEndReached={loadMore}
                DocumentsIds={SelectedDocumentsIds}
                setDocumentsIds={setSelectedDocumentsIds}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        backgroundColor: "white",
    },
    navbarWrapper: {
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 20,
        backgroundColor: "white",
        paddingTop: vScale(40),
        paddingHorizontal: scale(20),
    },
    FilterWrapper: {
        position: "absolute",
        left: 0, right: 0,
        zIndex: 10,
        backgroundColor: "white",
        paddingHorizontal: scale(20),
        paddingTop: vScale(10),
        paddingBottom: vScale(10),
    },
});

export default AddDocumentsPage