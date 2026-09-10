import { useCallback, useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";

const MIN_RAM_GB = 8;
const MIN_FREE_STORAGE_GB = 5;

type DeviceCompatibility = {
    loading: boolean;
    supported: boolean;
    ramGB: number | null;
    freeStorageGB: number | null;
    refresh: () => Promise<void>;
};

export function useDeviceCompatibility(): DeviceCompatibility {
    const [loading, setLoading] = useState(true);
    const [supported, setSupported] = useState(false);
    const [ramGB, setRamGB] = useState<number | null>(null);
    const [freeStorageGB, setFreeStorageGB] = useState<number | null>(null);

    const checkDevice = useCallback(async () => {
        try {
            setLoading(true);

            const [totalMemory, freeStorage] = await Promise.all([
                DeviceInfo.getTotalMemory(),
                DeviceInfo.getFreeDiskStorage(),
            ]);

            const ram = totalMemory / (1024 ** 3);
            const storage = freeStorage / (1024 ** 3);

            setRamGB(ram);
            setFreeStorageGB(storage);

            const isSupported =
                ram >= MIN_RAM_GB &&
                storage >= MIN_FREE_STORAGE_GB;

            setSupported(isSupported);
        } catch (error) {
            console.error(
                "Failed to check device compatibility:",
                error
            );

            setSupported(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkDevice();
    }, [checkDevice]);

    return {
        loading,
        supported,
        ramGB,
        freeStorageGB,
        refresh: checkDevice,
    };
}