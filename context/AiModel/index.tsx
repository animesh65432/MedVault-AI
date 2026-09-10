import { createContext, useState } from "react";

type AiModelContextType = {
    IsDownload: boolean;
    IsDownloading: boolean;
    OnChangeIsDownload: (newValue: boolean) => void;
    OnChangeIsDownloading: (newValue: boolean) => void;
    IsDownLoadCardShow: boolean;
    OnChangeIsDownLoadCardShow: (newValue: boolean) => void;
}

export const AiModelContext = createContext<AiModelContextType>({
    IsDownload: false,
    IsDownloading: false,
    OnChangeIsDownload: () => { },
    OnChangeIsDownloading: () => { },
    IsDownLoadCardShow: false,
    OnChangeIsDownLoadCardShow: () => { }
});

export const AiModelProvider = ({ children }: { children: React.ReactNode }) => {
    const [IsDownload, setIsDownload] = useState<boolean>(false);
    const [IsDownloading, setIsDownloading] = useState<boolean>(false);
    const [IsDownLoadCardShow, setIsDownLoadCardShow] = useState<boolean>(false);

    const OnChangeIsDownload = (newValue: boolean) => {
        setIsDownload(newValue);
    }

    const OnChangeIsDownloading = (newValue: boolean) => {
        setIsDownloading(newValue);
    }

    const OnChangeIsDownLoadCardShow = (newValue: boolean) => {
        setIsDownLoadCardShow(newValue);
    }

    return <AiModelContext.Provider
        value={{
            IsDownload,
            IsDownloading,
            OnChangeIsDownload,
            OnChangeIsDownloading,
            IsDownLoadCardShow,
            OnChangeIsDownLoadCardShow
        }}
    >
        {children}
    </AiModelContext.Provider>
}

