import { checkModelExists } from '@/hooks/checkModelExists';
import { Model } from '@/services/model';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Message } from 'react-native-executorch';
import { LLMModule } from 'react-native-executorch';

let _instance: LLMModule | null = null;

type LLMContextType = {
    modelReady: boolean;
    isLoading: boolean;
    loadModel: () => Promise<void>;
    generate: (messages: Message[]) => Promise<string>;
    setModelReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const LLMContext = createContext<LLMContextType>({} as LLMContextType);

export const LLMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modelReady, setModelReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkModelExists().then((exists) => {
            if (exists) loadModel();
        });
    }, []);

    const loadModel = async () => {
        if (_instance) { setModelReady(true); return; }
        if (isLoading) return;

        setIsLoading(true);
        try {
            _instance = await LLMModule.fromModelName({
                modelName: 'qwen3-0.6b',
                modelSource: Model.modelPath,
                tokenizerSource: Model.tokenizerPath,
                tokenizerConfigSource: Model.tokenizerConfigPath,
            });

            console.log('[LLMProvider] Model loaded successfully');

            const res = await _instance.generate([{ role: 'system', content: 'You are a helpful assistant.' }]);

            console.log('[LLMProvider] Test generation result:', res);

            const res1 = await _instance.generate([{ role: 'system', content: 'create json dummy products' }]);

            console.log('[LLMProvider] Test generation result:', res1);

            setModelReady(true);
        } catch (e) {
            console.error('[LLMProvider] load failed:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const generate = async (messages: Message[]): Promise<string> => {
        if (!_instance) throw new Error('Model not loaded');
        return _instance.generate(messages);
    };

    return (
        <LLMContext.Provider value={{ modelReady, isLoading, loadModel, generate, setModelReady }}>
            {children}
        </LLMContext.Provider>
    );
};

export const useLLMContext = () => useContext(LLMContext);