import { createContext, useState } from "react"
import { MedicalDocument } from "@/types"

type Props = {
    Documents: MedicalDocument[];
    SetDocuments: React.Dispatch<React.SetStateAction<MedicalDocument[]>>;
}

export const DocumentsContext = createContext<Props>({
    Documents: [],
    SetDocuments: () => { }
});

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [docs, setDocs] = useState<MedicalDocument[]>([]);
    return (
        <DocumentsContext.Provider value={{ Documents: docs, SetDocuments: setDocs }}>
            {children}
        </DocumentsContext.Provider>
    );
};