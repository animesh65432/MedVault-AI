import * as FileSystem from 'expo-file-system/legacy';

export const copyPhotoToPermanentStorage = async (tempUri: string): Promise<string> => {

    const sourcesDir = FileSystem.documentDirectory + 'sources/';

    const dirInfo = await FileSystem.getInfoAsync(sourcesDir);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(sourcesDir, { intermediates: true });
    }

    const extension = tempUri.split('.').pop() ?? 'jpg';
    const filename = `doc_${Date.now()}_${Math.floor(Math.random() * 100000)}.${extension}`;
    const newPath = sourcesDir + filename;


    await FileSystem.copyAsync({
        from: tempUri,
        to: newPath,
    });

    return newPath;
};