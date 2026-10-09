import { GetDocuments } from "@/db/document"
import { DocumentRow, TypeOfDocumenet } from "@/types"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useSQLiteContext } from "expo-sqlite"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import Documents from "./Documents"
import Filter from "./Filter"
import Navabr from './Navbar'

export type selectedType = TypeOfDocumenet | "All Types"

const PAGE_SIZE = 20;

const AddDocumentsPage: React.FC = () => {
    const db = useSQLiteContext();
    const [selected, setSelected] = useState<selectedType>("All Types");
    const scrollY = useRef(new Animated.Value(0)).current;
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [filterHeight, setFilterHeight] = useState(0);
    const [documents, setdocuments] = useState<DocumentRow[]>([]);
    const [SelectedDocuments, setSelectedDocuments] = useState<DocumentRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const isLoadingMoreRef = useRef(false);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            let defaultSelected: selectedType[] = [];
            if (selected !== "All Types") {
                defaultSelected = [selected]
            }
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, 0, defaultSelected, {
                startDate: null,
                endDate: null,
            });
            setdocuments(rows);
            pageRef.current = 1;
            hasMoreRef.current = rows.length === PAGE_SIZE;
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoading(false);
        }
    }, [db, selected]);

    useEffect(() => {
        fetchDocuments();
    }, [selected])

    const loadMore = useCallback(async () => {
        if (!hasMoreRef.current || isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;

        let defaultSelected: selectedType[] = [];

        if (selected !== "All Types") {
            defaultSelected = [selected]
        }

        const nextPage = pageRef.current + 1;
        try {
            const rows = await GetDocuments(
                db,
                "DESC",
                PAGE_SIZE,
                (nextPage - 1) * PAGE_SIZE,
                defaultSelected,
                { startDate: null, endDate: null }
            );
            setdocuments((prev) => [...prev, ...rows]);
            hasMoreRef.current = rows.length === PAGE_SIZE;
            pageRef.current = nextPage;
        } catch (error) {
            console.error("Failed to load more documents:", error);
        } finally {
            isLoadingMoreRef.current = false;
        }
    }, [db]);

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
                <Navabr SelectedDocuments={SelectedDocuments} />
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
                <Filter />
            </Animated.View>
            <Documents
                documents={documents}
                onScroll={onScroll}
                isLoadingMore={isLoadingMoreRef.current}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                SelectedDocuments={SelectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
                NavbarHeight={navbarHeight + filterHeight}
                onEndReached={loadMore}
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