import { LFM2_5_1_2B_INSTRUCT_QUANTIZED } from "react-native-executorch"

export const Model = {
    modelName: 'Qwen 3 - 1.7B',
    family: 'Qwen 3',
    tokenizerPath: LFM2_5_1_2B_INSTRUCT_QUANTIZED.tokenizerSource,
    modelPath: LFM2_5_1_2B_INSTRUCT_QUANTIZED.modelSource,
    tokenizerConfigPath: LFM2_5_1_2B_INSTRUCT_QUANTIZED.tokenizerConfigSource,
    source: 'remote',
    parameters: 2.03,
    modelSize: 2.16,
    featured: true,
    thinking: true,
    labels: ['Fast', 'Reasoning'],
}

