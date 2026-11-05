import React, { createContext, useState } from 'react'

type AttachmentDocumentsIdsContextType = {
    documentsIds: number[]
    setDocumentsIds: React.Dispatch<React.SetStateAction<number[]>>
}

export const AttachmentDocumentsIdsContext = createContext<AttachmentDocumentsIdsContextType>({
    documentsIds: [],
    setDocumentsIds: () => { },
})

export const AttachmentDocumentsIdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [documentsIds, setDocumentsIds] = useState<number[]>([])
    return (
        <AttachmentDocumentsIdsContext.Provider value={{ documentsIds, setDocumentsIds }}>
            {children}
        </AttachmentDocumentsIdsContext.Provider>
    )
}