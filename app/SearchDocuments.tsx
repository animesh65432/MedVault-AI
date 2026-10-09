import Search from '@/components/Search';
import { useLocalSearchParams } from "expo-router";
import React from 'react';

const SearchDocuments: React.FC = () => {
    const { ShowResults } = useLocalSearchParams<{
        ShowResults: string;
    }>();
    const showResults = ShowResults === "true";
    return (
        <Search
            showResults={showResults}
        />
    )
}

export default SearchDocuments