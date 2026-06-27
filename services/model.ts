import { QWEN3_1_7B_QUANTIZED } from "react-native-executorch"

export const Model = {
    modelName: 'Qwen 3 - 1.7B',
    family: 'Qwen 3',
    tokenizerPath: QWEN3_1_7B_QUANTIZED.tokenizerSource,
    modelPath: QWEN3_1_7B_QUANTIZED.modelSource,
    tokenizerConfigPath: QWEN3_1_7B_QUANTIZED.tokenizerConfigSource,
    source: 'remote',
    parameters: 2.03,
    modelSize: 2.16,
    featured: true,
    thinking: true,
    labels: ['Fast', 'Reasoning'],
}

