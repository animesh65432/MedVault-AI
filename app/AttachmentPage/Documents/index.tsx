
import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { GetDocuments } from "@/db/document";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
} from "react-native";
import Document from "./Document";

type Props = {
    selected: string;
};

const PAGE_SIZE = 40;

const Documents: React.FC<Props> = ({ selected }) => {
    const db = useSQLiteContext();

    const [page, setPage] = useState(0);
    const [documentsIds, setDocumentsIds] = useState<number[]>([]);
    const [documents, setDocuments] = useState<DocumentRow[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchDocuments = useCallback(async (
        currentPage: number,
        isNewFilter: boolean
    ) => {
        if (isNewFilter) {
            setInitialLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const filteredSelected =
                selected === "All Types" ? [] : [selected];

            const docs = await GetDocuments(
                db,
                "DESC",
                PAGE_SIZE,
                currentPage,
                filteredSelected
            );

            setDocuments(prev => {
                if (isNewFilter) return docs;

                const existingIds = new Set(prev.map(doc => doc.Id));

                return [
                    ...prev,
                    ...docs.filter(doc => !existingIds.has(doc.Id))
                ];
            });

            setHasMore(docs.length === PAGE_SIZE);

        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setInitialLoading(false);
            setLoadingMore(false);
        }
    }, [db, selected]);

    useEffect(() => {
        setPage(0);
        setDocuments([]);
        setHasMore(true);

        fetchDocuments(0, true);
    }, [selected]);

    const loadMore = () => {
        if (loadingMore || initialLoading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchDocuments(nextPage, false);
    };

    if (initialLoading) {
        return <DocumentsSkeleton count={6} />;
    }

    return (
        <FlatList
            data={documents}
            keyExtractor={item => item.Id.toString()}
            columnWrapperStyle={styles.columnWrapper}
            numColumns={3}
            renderItem={({ item }) => (
                <Document
                    doc={item}
                    DocumentsIds={documentsIds}
                    setDocumentsIds={setDocumentsIds}
                />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        style={styles.loader}
                        size="small"
                        color="#0D483F"
                    />
                ) : null
            }
            style={styles.Container}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
        />
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    columnWrapper: {
        columnGap: scale(10),
        marginBottom: vScale(10),
    },
    loader: {
        paddingVertical: scale(20),
    },
});

export default Documents;
