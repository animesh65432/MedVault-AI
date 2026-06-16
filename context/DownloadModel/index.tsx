import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect, useState } from "react"

type DownloadContextType = {
    IsDownload: boolean,
    OnChangeModel: (value: boolean) => Promise<void>,
    ModelPath: string,
    addModelPath: (path: string) => Promise<void>,
    VisionModelPath: string,
    addVisionModelPath: (path: string) => Promise<void>,
}

export const DownloadContext = createContext<DownloadContextType>({
    IsDownload: false,
    OnChangeModel: async (value: boolean) => { },
    ModelPath: "",
    addModelPath: async (path: string) => { },
    VisionModelPath: "",
    addVisionModelPath: async (path: string) => { },
})

type Props = {
    children: React.ReactNode
}

const DownloadProvider: React.FC<Props> = ({ children }) => {
    const [IsDownload, setIsDownload] = useState(false)
    const [ModelPath, setModelPath] = useState("")
    const [VisionModelPath, setVisionModelPath] = useState("")

    const OnChangeModel = async (value: boolean) => {
        await AsyncStorage.setItem("IsDownload", JSON.stringify(value));
        setIsDownload(value)
    }

    useEffect(() => {
        const fetchModelStatus = async () => {
            const value = await AsyncStorage.getItem("IsDownload");
            const modelPath = await AsyncStorage.getItem("ModelPath");
            const visionModelPath = await AsyncStorage.getItem("VisionModelPath");
            if (modelPath !== null) {
                setModelPath(modelPath);
            }
            if (visionModelPath !== null) {
                setVisionModelPath(visionModelPath);
            }
            if (value !== null) {
                setIsDownload(JSON.parse(value));
            }
        }
        fetchModelStatus();
    }, []);

    const addModelPath = async (path: string) => {
        setModelPath(path);
        await AsyncStorage.setItem("ModelPath", path);
    }

    const addVisionModelPath = async (path: string) => {
        setVisionModelPath(path);
        await AsyncStorage.setItem("VisionModelPath", path);
    }

    return <DownloadContext.Provider
        value={{
            IsDownload,
            OnChangeModel,
            ModelPath,
            addModelPath,
            VisionModelPath,
            addVisionModelPath
        }}
    >
        {children}
    </DownloadContext.Provider>
}

export default DownloadProvider