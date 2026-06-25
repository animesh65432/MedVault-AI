import { QWEN3_0_6B_QUANTIZED } from "react-native-executorch"

export const Model = {
    modelName: 'Qwen 3 - 0.6B',
    family: 'Qwen 3',
    tokenizerPath: QWEN3_0_6B_QUANTIZED.tokenizerSource,
    modelPath: QWEN3_0_6B_QUANTIZED.modelSource,
    tokenizerConfigPath: QWEN3_0_6B_QUANTIZED.tokenizerConfigSource,
    source: 'remote',
    parameters: 0.75,
    modelSize: 0.94,
    featured: true,
    thinking: true,
    labels: ['Fast', 'Reasoning'],
}

