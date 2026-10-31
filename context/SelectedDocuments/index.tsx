import React, { createContext, useState } from "react";


export const SelectedDocumentsContext = createContext<{
    SelectedDocumentsIds: number[];
    setSelectedDocumentsIds: React.Dispatch<React.SetStateAction<number[]>>;
    LoadedRecordId: string | null;
    setLoadedRecordId: React.Dispatch<React.SetStateAction<string | null>>;
}>({
    SelectedDocumentsIds: [],
    setSelectedDocumentsIds: () => { },
    LoadedRecordId: null,
    setLoadedRecordId: () => { },
});

const SelectedDocumentsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [SelectedDocumentsIds, setSelectedDocumentsIds] = useState<number[]>([]);
    const [LoadedRecordId, setLoadedRecordId] = useState<string | null>(null);

    return <SelectedDocumentsContext.Provider
        value={{
            SelectedDocumentsIds,
            setSelectedDocumentsIds,
            LoadedRecordId,
            setLoadedRecordId
        }}
    >
        {children}
    </SelectedDocumentsContext.Provider>
}

export default SelectedDocumentsProvider 