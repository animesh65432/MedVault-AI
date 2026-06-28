import { finalMedicalclassficationPrompt } from '@/utils/finalMedicalclassficationPrompt';
import { makeClassifyMedicalPrompt } from "@/utils/makeClassifyMedicalPrompt";
import { MakeMedicalDataJsonPrompt } from "@/utils/MakeMedicalDataJsonPrompt";

import {
    LLMModule,
    QWEN2_5_3B_QUANTIZED,
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
    Medicalclassfication: (messages: string) => Promise<string | null>;
    MakeMedicalDataJson: (messages: string) => Promise<string | null>;
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
                        modelSource: QWEN2_5_3B_QUANTIZED.modelSource,
                        tokenizerSource: QWEN2_5_3B_QUANTIZED.tokenizerSource,
                        tokenizerConfigSource: QWEN2_5_3B_QUANTIZED.tokenizerConfigSource,
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

                llmInstance.configure({
                    generationConfig: {
                        temperature: 0.1,
                        repetitionPenalty: 1.3,
                    },
                    toolsConfig: undefined
                });

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

        if (!instance) {
            console.warn('Model not loaded');
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
    },
    Medicalclassfication: async (content: string) => {
        const { generate } = get()
        const finalMedicalclassficatioPrompt = await finalMedicalclassficationPrompt(content)
        const res = await generate(finalMedicalclassficatioPrompt)
        return res
    },
    MakeMedicalDataJson: async (content: string) => {
        const { generate } = get();
        const classifyPrompt = await makeClassifyMedicalPrompt(content);
        const docType = (await generate(classifyPrompt))?.trim() ?? "Other";

        console.log("Document Type:", docType);

        const extractPrompt = await MakeMedicalDataJsonPrompt(content, docType);
        const medicalDataJson = await generate(extractPrompt);

        console.log("Extracted Medical Data JSON:", medicalDataJson);

        return medicalDataJson;
    }
}));