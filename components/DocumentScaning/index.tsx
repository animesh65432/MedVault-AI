import React from 'react';
import DocumentImage from './DocumentImage';

type Props = {
    fileUri: string;
    fileName: string;
    fileType: string;
}

const DocumentScanning: React.FC<Props> = ({ fileUri, fileType }) => {
    return (
        <DocumentImage
            fileUri={fileUri}
            IsPdf={fileType === "application/pdf" ? true : false}
        />

    );
};

export default DocumentScanning;