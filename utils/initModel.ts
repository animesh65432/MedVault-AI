import { initLlama, LlamaContext } from "llama.rn";

type InitModelResponse = {
    context: LlamaContext;
    multimodalReady: boolean;
};

export const initModel = async (
    modelPath: string,
    mmprojPath: string
): Promise<InitModelResponse> => {
    const context = await initLlama({
        model: modelPath,
        n_ctx: 4096,
        n_gpu_layers: 99,
    });

    const multimodalReady = await context.initMultimodal({
        path: mmprojPath,
        use_gpu: true,
    });

    return {
        context,
        multimodalReady,
    };
};