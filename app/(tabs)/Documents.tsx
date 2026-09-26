import DocumentsPage from '@/components/DocumentsPage';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Documents: React.FC = () => {
    return (
        <View style={styles.container}>
            <DocumentsPage />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default Documents