import React, { createContext } from 'react';

export const IsDownloadContext = createContext({
    IsDownload: false,
    setIsDownload: (value: boolean) => { },
});

type Props = {
    children: React.ReactNode;
}

const DowloadProvider: React.FC<Props> = ({ children }) => {
    const [IsDownload, setIsDownload] = React.useState(false);
    return (
        <IsDownloadContext.Provider
            value={{ IsDownload, setIsDownload }}
        >
            {children}
        </IsDownloadContext.Provider>
    )
}

export default DowloadProvider