import DeviceInfo from 'react-native-device-info';

export interface InferenceConfig {
    n_ctx: number;
    n_gpu_layers: number;
}

export async function getDynamicModelParams(): Promise<InferenceConfig> {
    try {
        const totalRamBytes = await DeviceInfo.getTotalMemory();
        const totalRamGB = totalRamBytes / (1024 * 1024 * 1024);


        if (totalRamGB >= 7.5) {
            return {
                n_ctx: 2048,
                n_gpu_layers: 99,
            };
        }

        if (totalRamGB >= 5.5) {
            return {
                n_ctx: 2048,
                n_gpu_layers: 16,
            };
        }
        return {
            n_ctx: 1024,
            n_gpu_layers: 0,
        };

    } catch (error) {
        console.warn("Failed to read system info, falling back to safest CPU profile.", error);
        return { n_ctx: 1024, n_gpu_layers: 0 };
    }
}
