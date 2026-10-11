import { DocumentRow } from "@/types";
import React, { createContext, useState } from "react";

export const SelectedDocumentsContext = createContext<{
    SelectedDocuments: DocumentRow[];
    setSelectedDocuments: React.Dispatch<React.SetStateAction<DocumentRow[]>>;
}>({
    SelectedDocuments: [],
    setSelectedDocuments: () => { },
});

const SelectedDocumentsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [SelectedDocuments, setSelectedDocuments] = useState<DocumentRow[]>([]);

    return <SelectedDocumentsContext.Provider value={{ SelectedDocuments, setSelectedDocuments }}>
        {children}
    </SelectedDocumentsContext.Provider>
}

export default SelectedDocumentsProvider 