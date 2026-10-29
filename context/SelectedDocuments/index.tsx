import React, { createContext, useState } from "react";


export const SelectedDocumentsContext = createContext<{
    SelectedDocumentsIds: number[];
    setSelectedDocumentsIds: React.Dispatch<React.SetStateAction<number[]>>;
}>({
    SelectedDocumentsIds: [],
    setSelectedDocumentsIds: () => { },
});

const SelectedDocumentsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [SelectedDocumentsIds, setSelectedDocumentsIds] = useState<number[]>([]);

    return <SelectedDocumentsContext.Provider
        value={{
            SelectedDocumentsIds,
            setSelectedDocumentsIds
        }}
    >
        {children}
    </SelectedDocumentsContext.Provider>
}

export default SelectedDocumentsProvider 