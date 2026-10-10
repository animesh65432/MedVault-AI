import AddDocumentsPage from '@/components/AddDocumentsPage';
import { TypeOfDocumenet } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const AddDocuments: React.FC = () => {
    const {
        searchQuery,
        startDate,
        endDate,
        SelectedCategoried,
    } = useLocalSearchParams<{
        searchQuery?: string;
        startDate?: string;
        endDate?: string;
        SelectedCategoried?: TypeOfDocumenet;
    }>();

    return (
        <AddDocumentsPage
            searchQuery={
                typeof searchQuery === 'string' ? searchQuery : null
            }
            startDate={
                typeof startDate === 'string' ? startDate : null
            }
            endDate={
                typeof endDate === 'string' ? endDate : null
            }
            SelectedCategoried={
                typeof SelectedCategoried === 'string'
                    ? SelectedCategoried
                    : null
            }
        />
    );
};

export default AddDocuments;