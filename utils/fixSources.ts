import { SourcesTypes } from "@/types";

export const fixSources = (data: any[]): SourcesTypes[] => {
    const Sources: SourcesTypes[] = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].SourceFilePath) {
            Sources.push({
                IsPdf: data[i].IsPdf,
                SourceFilePath: data[i].SourceFilePath
            })
        }
    }
    return Sources;
}
