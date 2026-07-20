import Documents from "@/components/Documents";
import DocumentsSkeleton from "@/components/DocumentsSkeleton";
import { DocumentRow } from "@/types";
import { scale } from "@/utils/scale";
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    documents: DocumentRow[];
    isLoading: boolean;
    isLoadingMore: boolean;
}

const NonEmpty: React.FC<Props> = ({ documents = [], isLoading, isLoadingMore }) => {

    if (isLoading) {
        return (
            <DocumentsSkeleton
                count={5}
            />
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Documents</Text>
            <Documents
                documents={documents}
            />
            {isLoadingMore && (
                <DocumentsSkeleton
                    count={3}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        color: '#708090',
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(14),
        marginBottom: scale(12),
        textTransform: "uppercase"
    },
    container: {
        flex: 1,
        paddingTop: scale(10),
    },
})

export default NonEmpty