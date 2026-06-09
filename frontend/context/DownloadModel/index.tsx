import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect, useState } from "react"

type DownloadContextType = {
    IsDownload: boolean,
    OnChangeModel: (value: boolean) => Promise<void>
}

export const DownloadContext = createContext<DownloadContextType>({
    IsDownload: false,
    OnChangeModel: async (value: boolean) => { }
})

type Props = {
    children: React.ReactNode
}

const DownloadProvider: React.FC<Props> = ({ children }) => {
    const [IsDownload, setIsDownload] = useState(false)

    const OnChangeModel = async (value: boolean) => {
        await AsyncStorage.setItem("IsDownload", JSON.stringify(value));
        setIsDownload(value)
    }

    useEffect(() => {
        const fetchModelStatus = async () => {
            const value = await AsyncStorage.getItem("IsDownload");
            if (value !== null) {
                setIsDownload(JSON.parse(value));
            }
        }
        fetchModelStatus();
    }, []);

    return <DownloadContext.Provider
        value={{
            IsDownload,
            OnChangeModel
        }}
    >
        {children}
    </DownloadContext.Provider>
}

export default DownloadProvider