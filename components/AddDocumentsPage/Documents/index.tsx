import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useCallback, useRef } from "react";
import {
    Animated,
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import Document from "./Document";

const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList
) as unknown as typeof FlatList;

type Props = {
    documents: DocumentRow[];
    onScroll: any;
    isLoadingMore: boolean;
    onEndReached?: () => void;
    selectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
    SelectedDocuments: DocumentRow[];
    setSelectedDocuments: React.Dispatch<React.SetStateAction<DocumentRow[]>>;
    NavbarHeight: number;
};

const Documents: React.FC<Props> = ({
    documents,
    onScroll,
    isLoadingMore,
    onEndReached,
    selectedIds,
    setSelectedDocuments,
    SelectedDocuments,
    setSelectedIds,
    NavbarHeight
}) => {

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = useCallback(
        ({ item }: { item: DocumentRow }) => (
            <Document
                doc={item}
                SelectedDocuments={SelectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
            />
        ),
        [selectedIds, SelectedDocuments]
    );

    const keyExtractor = useCallback(
        (item: DocumentRow) => String(item.Id),
        []
    );

    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <AntDesign name="folder" size={scale(24)} color="#082e28" />
                    <Text style={styles.emptyText}>No documents yet</Text>
                </View>
            </View>
        );
    }

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
                { paddingTop: NavbarHeight + vScale(10) },
            ]}
            columnWrapperStyle={styles.columnWrapper}
            removeClippedSubviews
            viewabilityConfig={viewabilityConfig}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoadingMore ? <DocumentsSkeleton count={3} /> : null}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: vScale(20)
    },
    columnWrapper: {
        columnGap: scale(10),
        marginBottom: vScale(10),
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    emptyContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(10)
    },
    emptyText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "black",
    },
});

export default Documents;