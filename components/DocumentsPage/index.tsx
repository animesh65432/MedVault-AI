import { COLORS } from "@/app/(tabs)/_layout";
import ChatBotAI from "@/components/ChatBotAI";
import Documents from "@/components/Documents";
import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { delete_documents, GetDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { scale } from "@/utils/scale";
import { shareDocuments } from "@/utils/shareDocuments";
import { vScale } from "@/utils/vScale";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import BelowNavbar from "./BelowNavbar";
import Navbar from "./Navbar";


const PAGE_SIZE = 20;

const DocumentsPage: React.FC = () => {
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [CurrentDate, SetCurrentDate] = useState<string>("");
    const [documents, setdocuments] = useState<DocumentRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [navbarHeight, setNavbarHeight] = useState<number>(0);
    const selectionMode = selectedIds.length > 0;

    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const isLoadingMoreRef = useRef(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    const onScroll = useMemo(
        () =>
            Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                useNativeDriver: true,
            }),
        [scrollY]
    );


    const navbarOffset = useMemo(
        () => Animated.diffClamp(scrollY, 0, Math.max(navbarHeight, 1)),
        [scrollY, navbarHeight]
    )


    const translateY = useMemo(
        () => Animated.multiply(navbarOffset, -1),
        [navbarOffset]
    );

    const pillOpacity = useMemo(
        () =>
            navbarOffset.interpolate({
                inputRange: [0, Math.max(navbarHeight, 1)],
                outputRange: [0, 1],
                extrapolate: "clamp",
            }),
        [navbarOffset, navbarHeight]
    );


    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, 0, [], {
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
    }, [db]);

    const loadMore = useCallback(async () => {
        if (!hasMoreRef.current || isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);

        const nextPage = pageRef.current + 1;
        try {
            const rows = await GetDocuments(
                db,
                "DESC",
                PAGE_SIZE,
                (nextPage - 1) * PAGE_SIZE,
                [],
                { startDate: null, endDate: null }
            );
            setdocuments((prev) => [...prev, ...rows]);
            hasMoreRef.current = rows.length === PAGE_SIZE;
            pageRef.current = nextPage;
        } catch (error) {
            console.error("Failed to load more documents:", error);
        } finally {
            isLoadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    }, [db]);

    useFocusEffect(
        useCallback(() => {
            const timeout = setTimeout(() => fetchDocuments(), 300);
            return () => clearTimeout(timeout);
        }, [fetchDocuments])
    );

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

    const handleShare = async () => {
        const selected = documents.filter((d) => selectedIds.includes(d.Id))
        await shareDocuments(selected)
    }

    const handleDelete = async () => {
        delete_documents(db, selectedIds)
        setSelectedIds([])
        fetchDocuments()
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.navbarWrapper, { transform: [{ translateY }] }]}
                onLayout={(e: LayoutChangeEvent) => {
                    if (navbarHeight === 0) {
                        setNavbarHeight(e.nativeEvent.layout.height + 5);
                    }
                }}
            >
                <Navbar />
            </Animated.View>

            <Animated.View
                pointerEvents="none"
                style={[styles.TopStickyDate, { opacity: pillOpacity }]}
            >
                <View style={styles.DateContainer}>
                    <Text style={styles.date_text}>{formatDate(CurrentDate)}</Text>
                </View>
            </Animated.View>

            {isLoading && documents.length === 0 ? (
                <DocumentsSkeleton count={20} />
            ) : (
                <Documents
                    documents={documents}
                    onScroll={onScroll}
                    navbarHeight={navbarHeight}
                    SetCurrentDate={SetCurrentDate}
                    isLoadingMore={isLoadingMore}
                    onEndReached={loadMore}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                />
            )}
            <ChatBotAI
                currentDocument="false"
            />
            {selectionMode &&
                <BelowNavbar
                    count={selectedIds.length}
                    onClose={() => setSelectedIds([])}
                    onShare={handleShare}
                    onDelete={handleDelete}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    navbarWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "white",
        width: "100%",
        paddingVertical: vScale(10),
    },
    TopStickyDate: {
        position: "absolute",
        top: vScale(40),
        left: 0,
        right: 0,
        zIndex: 50,
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
    date_text: {
        fontSize: 14,
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
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
});

export default DocumentsPage;