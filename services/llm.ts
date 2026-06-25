import { LLMModule } from "react-native-executorch";
import { Model } from "./model";

let _instance: LLMModule | null = null;
let _initPromise: Promise<LLMModule> | null = null;
let _queue: Promise<unknown> = Promise.resolve();

export const Load = (): Promise<LLMModule> => {
    if (_instance) return Promise.resolve(_instance);
    if (_initPromise) return _initPromise;

    _initPromise = LLMModule.fromModelName({
        modelName: "qwen3-0.6b",
        modelSource: Model.modelPath,
        tokenizerSource: Model.tokenizerPath,
        tokenizerConfigSource: Model.tokenizerConfigPath,
    }).then((llm) => {
        _instance = llm;
        _initPromise = null;
        return llm;
    });

    return _initPromise;
};

// export const generateWithLock = (
//     messages: { role: string; content: string }[]
// ): Promise<string> => {
//     // chain onto queue — each call waits for all previous to finish
//     const result = _queue.then(async () => {
//         const llm = await getLLM();
//         return llm.generate(messages.map(message => ({
//             ...message,
//             role: message.role as "system" | "user" | "assistant",
//         })));
//     });

//     // update queue to this call (swallow errors so queue never breaks)
//     _queue = result.catch(() => { });

//     return result;
// };