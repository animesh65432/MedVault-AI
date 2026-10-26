import { GetSummaryRecords } from "@/db/Record";
import { RecordSummaryWithDocuments } from "@/types";
import { vScale } from "@/utils/vScale";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    View,
    ViewToken,
} from "react-native";
import EmptyRecords from "./EmptyRecords";
import Record from "./Record";
import RecordSkeleton from "./Skeleton";

const PAGE_SIZE = 10;

const AnimatedFlatList =
    Animated.createAnimatedComponent(FlatList<RecordSummaryWithDocuments>);

type Props = {
    navbarHeight: number;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    SetCurrentDate: React.Dispatch<React.SetStateAction<string>>;
};

const Records: React.FC<Props> = ({ SetCurrentDate, navbarHeight, onScroll }) => {
    const db = useSQLiteContext();
    const [records, setRecords] = useState<RecordSummaryWithDocuments[]>([]);
    const offsetRef = useRef(1);
    const hasMoreRef = useRef(true);
    const isLoadingRef = useRef(false);
    const isLoadingMoreRef = useRef(false);

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken<RecordSummaryWithDocuments>[] }) => {
            const top = viewableItems[0];
            if (top?.item?.CreatedAt) SetCurrentDate(top.item.CreatedAt);
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    useFocusEffect(
        useCallback(() => {
            (async () => {
                isLoadingRef.current = true;
                try {
                    const rows = await GetSummaryRecords(db, PAGE_SIZE, 0);
                    setRecords(rows);
                    hasMoreRef.current = rows.length === PAGE_SIZE;
                } catch (e) {
                    console.error("Failed to fetch records:", e);
                }
                finally {
                    isLoadingRef.current = false;
                }
            })();
        }, [db])
    );

    const loadMore = useCallback(async () => {
        if (!hasMoreRef.current || isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;
        try {
            const rows = await GetSummaryRecords(db, PAGE_SIZE, offsetRef.current);
            setRecords((prev) => {
                const seen = new Set(prev.map((r) => r.Id));
                return [...prev, ...rows.filter((r) => !seen.has(r.Id))];
            });
            offsetRef.current += rows.length;
            hasMoreRef.current = rows.length === PAGE_SIZE;
        } catch (e) {
            console.error("Failed to load more records:", e);
        } finally {
            isLoadingMoreRef.current = false;
        }
    }, [db]);

    if (records.length === 0 && !isLoadingRef.current) {
        return <EmptyRecords />;
    }

    if (isLoadingRef.current && records.length === 0) {
        return <View
            style={{
                paddingTop: navbarHeight,
                gap: vScale(20),
                paddingBottom: vScale(180)
            }}
        >
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
        </View>
    }

    return (
        <AnimatedFlatList
            data={records}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(r) => String(r.Id)}
            renderItem={({ item }) => <Record record={item} />}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{
                paddingTop: navbarHeight,
                gap: vScale(20),
                paddingBottom: vScale(180),
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onEndReached={loadMore}
            ListEmptyComponent={isLoadingMoreRef.current ?
                <>
                    <RecordSkeleton />
                    <RecordSkeleton />
                    <RecordSkeleton />
                </> :
                null
            }
        />
    );
};

export default Records;