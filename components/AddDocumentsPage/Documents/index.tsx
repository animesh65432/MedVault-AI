import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useCallback } from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import Document from "./Document";

const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList
) as unknown as typeof FlatList;

type Props = {
    documents: DocumentRow[];
    onScroll: any;
    isLoadingMore: boolean;
    onEndReached?: () => void;
    SelectedDocuments: DocumentRow[];
    setSelectedDocuments: React.Dispatch<React.SetStateAction<DocumentRow[]>>;
    NavbarHeight: number;
};

const Documents: React.FC<Props> = ({
    documents,
    onScroll,
    isLoadingMore,
    onEndReached,
    setSelectedDocuments,
    SelectedDocuments,
    NavbarHeight,
}) => {
    const renderItem = useCallback(
        ({ item }: { item: DocumentRow }) => (
            <Document
                doc={item}
                SelectedDocuments={SelectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
            />
        ),
        [SelectedDocuments]
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
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyContent}>
                        <AntDesign name="folder" size={scale(24)} color="#082e28" />
                        <Text style={styles.emptyText}>No documents yet</Text>
                    </View>
                </View>
            }
            ListFooterComponent={isLoadingMore ? <DocumentsSkeleton count={3} /> : null}
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