import { LocalDefaultModel } from "@/utils/contensnt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { LLMModule, ResourceFetcher, type Message } from "react-native-executorch";
import { ExpoResourceFetcher } from "react-native-executorch-expo-resource-fetcher";

const MS_PER_FRAME = 1000 / 60;

type ModelType = "remote" | "on-device";

type AiModelContextType = {
    isDownloadCardShown: boolean;
    setIsDownloadCardShown: (value: boolean) => void;
    modelType: ModelType;
    setModelType: (value: ModelType) => void;
    isModelDownloaded: boolean;
    isDownloading: boolean;
    downloadProgress: number;
    downloadModel: () => Promise<void>;
    handleDownloadCardShown: () => Promise<void>;
    llmInstance: LLMModule | null;
    loadModel: () => Promise<void>;
    isModelLoading: boolean;
    isStreaming: boolean;
    generate: (messages: Message[], streamToUI?: boolean) => Promise<string | null>;
    liveResponse: string;
};

export const AiModelContext = createContext<AiModelContextType>({
    isDownloadCardShown: true,
    setIsDownloadCardShown: () => { },
    modelType: "remote",
    setModelType: () => { },
    isModelDownloaded: false,
    isDownloading: false,
    downloadProgress: 0,
    downloadModel: async () => { },
    handleDownloadCardShown: async () => { },
    llmInstance: null,
    loadModel: async () => { },
    isModelLoading: false,
    isStreaming: false,
    generate: async () => null,
    liveResponse: "",
});

const checkModelDownloaded = async (): Promise<boolean> => {
    const isDownloaded = await AsyncStorage.getItem("isModelDownloaded");
    return isDownloaded === "true";
};

export const AiModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDownloadCardShown, setIsDownloadCardShown] = useState(false);
    const [modelType, setModelType] = useState<ModelType>("remote");
    const [isModelDownloaded, setIsModelDownloaded] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [llmInstance, setLlmInstance] = useState<LLMModule | null>(null);
    const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [liveResponse, setLiveResponse] = useState<string>("");


    useEffect(() => {
        checkModelDownloaded()
            .then((downloaded) => {
                setIsModelDownloaded(downloaded);
                setModelType(downloaded ? "on-device" : "remote");
            })
            .catch((error) => {
                console.log("Error checking model download status:", error);
            });
    }, [])

    // Streaming-related mutable state — refs, not useState, because these
    // get updated many times per second (once per token) and don't need
    // to trigger re-renders themselves; only liveResponse (via flushStream) does.
    const streamBufferRef = useRef("");
    const streamFlushScheduledRef = useRef(false);
    const isStreamingRef = useRef(false); // mirrors isStreaming, readable inside the callback without stale closures

    const handleDownloadCardShown = useCallback(async () => {
        setIsDownloadCardShown((prev) => {
            const newValue = !prev;
            AsyncStorage.setItem("isDownloadCardShown", JSON.stringify(newValue));
            return newValue;
        });
    }, []);


    const removeAllModelFiles = useCallback(async () => {
        console.log("Removing model files...");
        try {
            await ExpoResourceFetcher.deleteResources(
                LocalDefaultModel.modelPath,
                LocalDefaultModel.tokenizerPath,
                LocalDefaultModel.tokenizerConfigPath
            );
            await AsyncStorage.removeItem("isModelDownloaded");
            setIsModelDownloaded(false);
            setDownloadProgress(0);
            console.log("Model files removed");
        } catch (err) {
            console.error("Failed to remove model files:", err);
        }
    }, []);

    const downloadModel = useCallback(async () => {
        if (isDownloading) {
            console.log("Download already in progress, skipping duplicate call");
            return;
        }

        console.log("Starting model download...");

        await removeAllModelFiles(); // Ensure old files are removed before downloading new ones

        let lastReportedPercent = -1;
        let lastReportTime = Date.now();
        setIsDownloading(true);

        try {
            const result = await ResourceFetcher.fetch(
                (p: number) => {
                    const currentPercent = Math.floor(p * 100);
                    if (
                        currentPercent !== lastReportedPercent &&
                        lastReportTime + MS_PER_FRAME < Date.now()
                    ) {
                        lastReportedPercent = currentPercent;
                        lastReportTime = Date.now();
                        setDownloadProgress(currentPercent);
                    }
                },
                LocalDefaultModel.modelPath,
                LocalDefaultModel.tokenizerPath,
                LocalDefaultModel.tokenizerConfigPath
            );

            if (result === null) return;

            await AsyncStorage.setItem("isModelDownloaded", "true");
            setIsModelDownloaded(true);
            setDownloadProgress(100);
            handleDownloadCardShown();
        } catch (err) {
            console.error("Model download failed:", err);
        } finally {
            setIsDownloading(false);
            setModelType("on-device");
        }
    }, [isDownloading, handleDownloadCardShown]);

    const flushStream = useCallback(() => {
        streamFlushScheduledRef.current = false;
        if (!streamBufferRef.current) return;
        const text = streamBufferRef.current;
        streamBufferRef.current = "";
        setLiveResponse((prev) => prev + text);
    }, []);

    const loadModel = useCallback(async () => {
        if (llmInstance && isModelDownloaded) return;
        setIsModelLoading(true);
        try {
            const llm = await LLMModule.fromModelName(
                {
                    modelName: 'custom' as Parameters<typeof LLMModule.fromModelName>[0]['modelName'],
                    modelSource: LocalDefaultModel.modelPath,
                    tokenizerSource: LocalDefaultModel.tokenizerPath,
                    tokenizerConfigSource: LocalDefaultModel.tokenizerConfigPath,
                    capabilities: LocalDefaultModel.vision ? (['vision'] as const) : undefined,
                },
                () => { },
                (token: string) => {
                    if (!isStreamingRef.current) return;
                    streamBufferRef.current += token;
                    if (!streamFlushScheduledRef.current) {
                        streamFlushScheduledRef.current = true;
                        requestAnimationFrame(flushStream);
                    }
                }
            );

            setLlmInstance(llm);
        } catch (err) {
            console.log("Failed to load model:", err);
        } finally {
            console.log("Model loading finished");
            setIsModelLoading(false);
        }
    }, [llmInstance, flushStream]);


    const generate = useCallback(
        async (messages: Message[], streamToUI: boolean = true): Promise<string | null> => {
            if (!llmInstance) {
                console.warn("Model not loaded yet");
                loadModel();
                return null;
            }

            setIsStreaming(streamToUI);
            isStreamingRef.current = streamToUI;
            streamBufferRef.current = "";
            setLiveResponse("");

            try {
                const finalResponse = await llmInstance.generate(messages);
                return finalResponse ?? null;
            } finally {
                setIsStreaming(false);
                isStreamingRef.current = false;
            }
        },
        [llmInstance]
    );
    return (
        <AiModelContext.Provider
            value={{
                isDownloadCardShown,
                setIsDownloadCardShown,
                modelType,
                setModelType,
                isModelDownloaded,
                isDownloading,
                downloadProgress,
                downloadModel,
                handleDownloadCardShown,
                llmInstance,
                loadModel,
                isModelLoading,
                isStreaming,
                generate,
                liveResponse,
            }}
        >
            {children}
        </AiModelContext.Provider>
    );
};