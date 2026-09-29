import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    View,
    ViewToken,
} from "react-native";
import Document from "./Document";

type Props = {
    documents: DocumentRow[];
    onScroll: (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => void;
    navbarHeight: number;
    SetCurrentDate: React.Dispatch<React.SetStateAction<string>>;
    CurrentDate: string;
};

const Documents: React.FC<Props> = ({
    documents,
    onScroll,
    navbarHeight,
    SetCurrentDate
}) => {

    const onViewableItemsChanged = ({
        viewableItems,
    }: {
        viewableItems: ViewToken<DocumentRow>[];
    }) => {
        if (viewableItems.length === 0) return;

        const top = viewableItems[0];

        if (top.item && top.item.date) {
            SetCurrentDate(top.item.date);
        }
    };

    if (documents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContent}>
                    <AntDesign
                        name="folder"
                        size={scale(24)}
                        color="#082e28"
                    />

                    <Text style={styles.emptyText}>
                        No documents yet
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <FlatList
            data={documents}
            renderItem={({ item }) => (
                <Document
                    doc={item}
                    SetCurrentDate={SetCurrentDate}
                />
            )}
            keyExtractor={(item) => String(item.Id)}
            numColumns={3}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingTop: navbarHeight + vScale(10) }]}
            columnWrapperStyle={styles.columnWrapper}
            removeClippedSubviews={true}
            onViewableItemsChanged={onViewableItemsChanged}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: scale(10),
        paddingBottom: vScale(20),
    },

    columnWrapper: {
        justifyContent: "center",
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