import { initLlama, LlamaContext } from "llama.rn";
import { getDynamicModelParams } from "./modelBudget";

type InitModelResponse = {
    context: LlamaContext;
};

export const initModel = async (
    modelPath: string,
    mmprojPath: string
): Promise<InitModelResponse> => {
    try {
        const { n_ctx, n_gpu_layers } = await getDynamicModelParams();

        const context = await initLlama({
            model: modelPath,
            n_gpu_layers: n_gpu_layers,
            ctx_shift: false,
            n_ctx: n_ctx,
        });

        const isGpuSupported = n_gpu_layers > 0;

        const success = await context.initMultimodal({
            path: mmprojPath,
            use_gpu: isGpuSupported
        });

        console.log('Multimodal enabled:', await context.isMultimodalEnabled());

        if (success) {
            console.log('Multimodal support initialized!');
            const support = await context.getMultimodalSupport();
            console.log('Vision support:', support.vision);
            console.log('Audio support:', support.audio);
        } else {
            console.log('Failed to initialize multimodal support');
        }

        return {
            context
        };

    } catch (error) {
        console.error("MODEL INITIALIZATION ERROR:", error);
        throw error;
    }
};
