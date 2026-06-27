import {
    LLMModule,
    QWEN3_1_7B_QUANTIZED,
    type Message as ExecutorchMessage
} from 'react-native-executorch';
import { create } from 'zustand';

interface LLMStore {
    isLoading: boolean;
    isGenerating: boolean;
    isProcessingPrompt: boolean;
    performance: {
        tokenCount: number;
        firstTokenTime: number;
    };

    loadModel: () => Promise<void>;
    generate: (messages: ExecutorchMessage[]) => Promise<string | null>;
    interrupt: () => void;
    IsModelLoaded: boolean;
}


let llmInstance: LLMModule | null = null;
let _loadPromise: Promise<void> | null = null;

const calculatePerformanceMetrics = (
    startTime: number,
    endTime: number,
    firstTokenTime: number,
    tokenCount: number
) => {
    const totalTime = endTime - startTime;
    const timeToFirstToken = firstTokenTime ? firstTokenTime - startTime : totalTime;
    const timeAfterFirst = Math.max(1, totalTime - timeToFirstToken);
    const tokensPerSecond = tokenCount / (timeAfterFirst / 1000);
    return { totalTime, timeToFirstToken, tokensPerSecond };
};

export const useLLMStore = create<LLMStore>((set, get) => ({
    isLoading: false,
    isGenerating: false,
    isProcessingPrompt: false,
    performance: { tokenCount: 0, firstTokenTime: 0 },
    IsModelLoaded: llmInstance !== null,

    loadModel: async () => {
        if (llmInstance) return;
        if (_loadPromise) return _loadPromise;

        set({ isLoading: true });

        _loadPromise = (async () => {
            try {
                llmInstance = await LLMModule.fromModelName(
                    {
                        modelName: 'custom' as Parameters<
                            typeof LLMModule.fromModelName
                        >[0]['modelName'],
                        modelSource: QWEN3_1_7B_QUANTIZED.modelSource,
                        tokenizerSource: QWEN3_1_7B_QUANTIZED.tokenizerSource,
                        tokenizerConfigSource: QWEN3_1_7B_QUANTIZED.tokenizerConfigSource,
                        capabilities: undefined,
                    },
                    () => { },
                    (token) => {
                        const snapshot = get();
                        const isFirstToken = snapshot.performance.tokenCount === 0;

                        if (isFirstToken && !snapshot.isProcessingPrompt && !snapshot.isGenerating) {
                            llmInstance?.interrupt();
                            return;
                        }

                        const firstTokenTime = isFirstToken
                            ? performance.now()
                            : snapshot.performance.firstTokenTime;

                        set((state) => ({
                            isProcessingPrompt: false,
                            performance: {
                                tokenCount: state.performance.tokenCount + 1,
                                firstTokenTime,
                            },
                        }));
                    }
                );

                const generationConfig = QWEN3_1_7B_QUANTIZED.generationConfig;
                if (generationConfig) {
                    llmInstance.configure({ generationConfig });
                }

                set({ isLoading: false });
                set({ IsModelLoaded: true });
            } catch (e) {
                console.error('Failed to load model:', e);
                set({ isLoading: false });
                llmInstance = null;
            } finally {
                _loadPromise = null;
            }
        })();

        return _loadPromise;
    },
    generate: async (messages) => {
        const instance = llmInstance;

        const { isGenerating } = get();

        if (!instance) {
            console.warn('Model not loaded');
            return null;
        }

        if (isGenerating) {
            console.warn('Generation already in progress');
            return null;
        }

        set({
            isGenerating: true,
            isProcessingPrompt: true,
            performance: { tokenCount: 0, firstTokenTime: 0 },
        });


        try {
            const startTime = performance.now();
            const response = await instance.generate(messages);
            const endTime = performance.now();

            if (response) {
                const { timeToFirstToken, tokensPerSecond } = calculatePerformanceMetrics(
                    startTime,
                    endTime,
                    get().performance.firstTokenTime,
                    instance.getGeneratedTokenCount()
                );
                console.log(`${tokensPerSecond.toFixed(1)} tok/s, TTFT: ${timeToFirstToken}ms`);
            }

            return response ?? null;
        } catch (e) {
            console.error('Generation failed:', e);
            return null;
        } finally {
            set({ isGenerating: false, isProcessingPrompt: false });
        }
    },
    interrupt: () => {
        llmInstance?.interrupt();
        set({ isGenerating: false, isProcessingPrompt: false });
    }
}));