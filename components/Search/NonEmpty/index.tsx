import Documents from "@/components/Documents";
import { DocumentRow } from "@/types";
import { StyleSheet, View } from 'react-native';

type Props = {
    documents: DocumentRow[];
    SelectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    SelectedDate: {
        startDate: Date | null;
        endDate: Date | null;
    };
    setSelectedDate: React.Dispatch<React.SetStateAction<{
        startDate: Date | null;
        endDate: Date | null;
    }>>;
    hasQuery: boolean;
}

const NonEmpty: React.FC<Props> = ({ documents = [], SelectedCategories, setSelectedCategories, setSelectedDate, SelectedDate }) => {
    return (
        <View style={styles.container}>
            <Documents
                documents={documents}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

export default NonEmpty