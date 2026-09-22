import React from 'react';
import DocumentImage from './DocumentImage';

type Props = {
    fileUri: string;
    fileName: string;
    fileType: string;
}

const DocumentScanning: React.FC<Props> = ({ fileUri, fileName, fileType }) => {
    return (
        <DocumentImage
            fileUri={fileUri}
        />

    );
};

export default DocumentScanning;