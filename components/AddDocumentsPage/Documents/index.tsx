import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import React, { useCallback } from "react";
import { Animated, FlatList, StyleSheet } from "react-native";
import Document from "./Document";

const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList
) as unknown as typeof FlatList;

type Props = {
    documents: DocumentRow[];
    onScroll: any;
    isLoadingMore: boolean;
    onEndReached?: () => void;
    NavbarHeight: number;
    DocumentsIds: number[];
    setDocumentsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const Documents: React.FC<Props> = ({
    documents,
    onScroll,
    isLoadingMore,
    onEndReached,
    NavbarHeight,
    DocumentsIds,
    setDocumentsIds,
}) => {
    const renderItem = useCallback(
        ({ item }: { item: DocumentRow }) => (
            <Document
                doc={item}
                DocumentsIds={DocumentsIds}
                setDocumentsIds={setDocumentsIds}
            />
        ),
        [DocumentsIds]
    );

    const keyExtractor = useCallback(
        (item: DocumentRow) => String(item.Id),
        []
    );

    return (
        <AnimatedFlatList
            data={documents}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                styles.listContent,
                { paddingTop: NavbarHeight },
                documents.length === 0 && styles.emptyGrow,
            ]}
            columnWrapperStyle={styles.columnWrapper}
            removeClippedSubviews
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoadingMore ? <DocumentsSkeleton count={10} /> : null}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: vScale(20),
    },
    emptyGrow: {
        flexGrow: 1,
    },
    columnWrapper: {
        columnGap: scale(10),
        marginBottom: vScale(10),
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(10),
    },
    emptyText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "black",
    },
});

export default Documents;