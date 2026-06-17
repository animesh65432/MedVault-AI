import { initLlama, LlamaContext } from "llama.rn";
import { getDynamicModelParams } from "./modelBudget";

type InitModelResponse = {
    context: LlamaContext;
    multimodalReady: boolean;
};

export const initModel = async (
    modelPath: string,
    mmprojPath: string
): Promise<InitModelResponse> => {
    try {
        const { n_ctx, n_gpu_layers } = await getDynamicModelParams();

        const context = await initLlama({
            model: modelPath,
            n_ctx: n_ctx,
            n_gpu_layers: n_gpu_layers,
            ctx_shift: false,
        });


        const isGpuSupported = n_gpu_layers > 0;

        const multimodalReady = await context.initMultimodal({
            path: mmprojPath,
            use_gpu: isGpuSupported,
        });


        if (!multimodalReady) {
            throw new Error("Failed to initialize multimodal projector");
        }

        return {
            context,
            multimodalReady,
        };

    } catch (error) {
        console.error("MODEL INITIALIZATION ERROR:", error);
        throw error;
    }
};
