import { DocumentRow, RecordDetails } from '@/types';
import React from 'react';
import { View } from 'react-native';

type Props = {
    record: RecordDetails;
    Documents: DocumentRow[];
}

const RecordDetailsPage: React.FC<Props> = ({ record, Documents }) => {
    return (
        <View></View>
    )
}

export default RecordDetailsPage