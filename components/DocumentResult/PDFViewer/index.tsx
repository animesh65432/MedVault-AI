import { Modal, StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
    uri: string;
    visible: boolean;
    Onclose: () => void;
};


const PDFViewer = ({ uri, visible, Onclose }: Props) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={Onclose}
        >
            <View style={styles.container}>
                <Pdf
                    source={{ uri }}
                    style={styles.pdf}
                    onLoadComplete={(pages) => {
                        console.log("Pages:", pages);
                    }}
                    onError={(e) => {
                        console.log(e);
                    }}
                />
            </View>
        </Modal>
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