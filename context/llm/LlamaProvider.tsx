import { initModel } from "@/utils/initModel";
import { LlamaContext } from "llama.rn";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DownloadContext } from "../DownloadModel";

type LlamaContextType = {
    context: LlamaContext | null;
    loading: boolean;
};

const LlamaProviderContext = createContext<LlamaContextType>({
    context: null,
    loading: true,
});

export const LlamaProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { ModelPath, VisionModelPath, IsDownload } =
        useContext(DownloadContext);
    const [context, setContext] = useState<LlamaContext | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadModel = async () => {
            if (!IsDownload || context || ModelPath.length === 0 || VisionModelPath.length === 0) return;

            console.log("Loading model with paths:", ModelPath, VisionModelPath);

            const result = await initModel(
                ModelPath,
                VisionModelPath
            );

            if (mounted) {
                setContext(result.context);
                setLoading(false);
            }
        };

        loadModel();

        return () => {
            mounted = false;
        };
    }, [IsDownload]);

    return (
        <LlamaProviderContext.Provider
            value={{ context, loading }}
        >
            {children}
        </LlamaProviderContext.Provider>
    );
};

export const useLlama = () =>
    useContext(LlamaProviderContext);