import Documents from "@/components/Documents";
import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { GetDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import Navbar from "./Navbar";

const PAGE_SIZE = 20
const HIDE_THRESHOLD = 4

const DocumentsPage: React.FC = () => {
    const [page, setPage] = useState<number>(1)
    const [CurrentDate, SetCurrentDate] = useState<string>('')
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isLoadingMoreRef = useRef(false)
    const [documents, setdocuments] = useState<DocumentRow[]>([])
    const db = useSQLiteContext()

    const [navbarHeight, setNavbarHeight] = useState(0)
    const translateY = useRef(new Animated.Value(0)).current
    const lastScrollY = useRef(0)
    const [isNavbarVisible, setIsNavbarVisible] = useState(true)

    const showNavbar = () => {
        if (isNavbarVisible) return
        setIsNavbarVisible(true)
        Animated.timing(translateY, { toValue: 0, duration: 40, useNativeDriver: true }).start()
    }

    const hideNavbar = () => {
        if (!isNavbarVisible || navbarHeight === 0) return
        setIsNavbarVisible(false)
        Animated.timing(translateY, { toValue: -navbarHeight, duration: 50, useNativeDriver: true }).start()
    }


    async function fetchDocuments(reset: boolean) {
        if (reset) setIsLoading(true)
        else isLoadingMoreRef.current = true
        try {
            const targetPage = reset ? 1 : page
            const offset = (targetPage - 1) * PAGE_SIZE
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, [], {
                startDate: null,
                endDate: null,
            })
            setdocuments(prev => reset ? rows : [...prev, ...rows])
            setHasMore(rows.length === PAGE_SIZE)
            if (reset) setPage(1)
        } catch (error) {
            console.error("Failed to fetch documents:", error)
        } finally {
            if (reset) setIsLoading(false)
            else isLoadingMoreRef.current = false
        }
    }

    async function loadMore() {
        if (!hasMore || isLoadingMoreRef.current) return
        isLoadingMoreRef.current = true
        const nextPage = page + 1
        try {
            const offset = (nextPage - 1) * PAGE_SIZE
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, offset, [], {
                startDate: null,
                endDate: null,
            })
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
        }, [])
    );

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
        const currentY = contentOffset.y
        const diff = currentY - lastScrollY.current

        if (currentY <= 0) {
            showNavbar()
        } else if (diff > 0 && Math.abs(diff) > HIDE_THRESHOLD) {
            hideNavbar()
        } else if (diff < 0) {
            showNavbar()
        }

        lastScrollY.current = currentY

        if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) {
            loadMore()
        }
    }


    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.navbarWrapper, { transform: [{ translateY }] }]}
                onLayout={(e: LayoutChangeEvent) => {
                    if (navbarHeight === 0) setNavbarHeight(e.nativeEvent.layout.height + 5)
                }}
            >
                <Navbar />
            </Animated.View>
            {
                !isNavbarVisible && (
                    <View style={styles.TopStickyDate}>
                        <View style={styles.DateContainer}>
                            <Text>{formatDate(CurrentDate)}</Text>
                        </View>
                    </View>
                )
            }

            {isLoading && documents.length === 0 ? (
                <DocumentsSkeleton count={20} />
            ) : (
                <Documents
                    documents={documents}
                    onScroll={handleScroll}
                    navbarHeight={navbarHeight}
                    SetCurrentDate={SetCurrentDate}
                    CurrentDate={CurrentDate}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, height: "100%" },
    container: { flex: 1, display: "flex" },
    navbarWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "white",
        width: "100%",
        paddingVertical: vScale(10),
    },
    TopStickyDate: {
        position: "absolute",
        top: vScale(50),
        left: 0,
        right: 0,
        zIndex: 1000,
        elevation: 1000,

        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    DateContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "white",

        elevation: 10,
    },
})

export default DocumentsPage