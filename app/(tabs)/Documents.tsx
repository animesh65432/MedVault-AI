import DocumentsPage from '@/components/DocumentsPage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const Documents: React.FC = () => {
    const params = useLocalSearchParams();
    const { tableName } = params as { tableName: string };
    return (
        <DocumentsPage
            tableName={tableName}
        />
    )
}

export default Documents