import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import Document from "./Documents/Document";

type Props = {
    documents: DocumentRow[];
    isLoading: boolean;
    isLoadingMore: boolean;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const NonEmpty: React.FC<Props> = ({
    documents = [],
    isLoading,
    isLoadingMore,
    onScroll
}) => {

    if (isLoading) {
        return <DocumentsSkeleton count={5} />
    }

    return (
        <FlatList
            style={styles.container}
            data={documents}
            columnWrapperStyle={styles.ContentStyles}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={({ item }) => (
                <Document doc={item} />
            )}
            numColumns={3}
            ListFooterComponent={
                isLoadingMore
                    ? <DocumentsSkeleton count={3} />
                    : null
            }
            ItemSeparatorComponent={() => (
                <View style={{ height: scale(10) }} />
            )}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ContentStyles: {
        gap: scale(10),
    }
})

export default NonEmpty