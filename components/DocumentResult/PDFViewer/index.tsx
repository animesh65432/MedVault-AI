import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
    uri: string;
    visible: boolean;
    Onclose: () => void;
};

const PDFViewer = ({ uri, visible, Onclose }: Props) => {
    if (!visible) {
        return null
    }
    return (
        <View style={styles.container}>
            <Pdf
                source={{ uri, cache: true }}
                style={styles.pdf}
                onLoadComplete={(numberOfPages) => {
                    console.log(`Loaded ${numberOfPages} pages`);
                }}
                onError={(error) => {
                    console.error(error);
                    Onclose()
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default PDFViewer;