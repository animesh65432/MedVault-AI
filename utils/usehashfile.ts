import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

export const usehashFile = async (fileUri: string): Promise<string> => {

    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        fileContent
    );

    return hash;
};