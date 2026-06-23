import { initLlama, LlamaContext } from "llama.rn";
import { getDynamicModelParams } from "./modelBudget";

type InitModelResponse = {
    context: LlamaContext;
};

export const initModel = async (
    modelPath: string,
): Promise<InitModelResponse> => {
    try {
        const { n_ctx, n_gpu_layers } = await getDynamicModelParams();

        const context = await initLlama({
            model: modelPath,
            n_gpu_layers: n_gpu_layers,
            ctx_shift: false,
            n_ctx: n_ctx,
        });

        return {
            context
        };

    } catch (error) {
        console.error("MODEL INITIALIZATION ERROR:", error);
        throw error;
    }
};
