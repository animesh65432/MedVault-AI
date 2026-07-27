import { SourcesTypes } from "@/types";
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    sources: SourcesTypes[];
    onPressSource?: (source: SourcesTypes) => void;
};

const getFileName = (path: string): string => {
    const parts = path.split("/");
    return parts[parts.length - 1] || path;
};

const Sources: React.FC<Props> = ({ sources, onPressSource }) => {
    if (!sources || sources.length === 0) {
        return null;
    }

    return (
        <View style={style.container}>
            <View style={style.labelRow}>
                <Feather name="paperclip" size={fs(12)} color="#0D1F1C99" />
                <Text style={style.label}>
                    {sources.length === 1 ? "1 source" : `${sources.length} sources`}
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={style.chipRow}
            >
                {sources.map((source, index) => (
                    <TouchableOpacity
                        key={`${source.SourceFilePath}-${index}`}
                        style={style.chip}
                        activeOpacity={0.7}
                        onPress={() => onPressSource?.(source)}
                    >
                        <View style={style.iconWrap}>
                            <Feather
                                name={source.IsPdf ? "file-text" : "image"}
                                size={fs(12)}
                                color="#234338"
                            />
                        </View>
                        <Text style={style.chipText} numberOfLines={1}>
                            {getFileName(source.SourceFilePath)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        marginTop: vScale(10),
        paddingTop: vScale(8),
        borderTopWidth: 1,
        borderTopColor: "#0D1F1C10",
        gap: vScale(6),
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
    },
    label: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(11),
        color: "#0D1F1C99",
    },
    chipRow: {
        gap: scale(8),
        paddingRight: scale(4),
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6),
        backgroundColor: "#EEF6A2",
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: vScale(6),
        maxWidth: scale(160),
    },
    iconWrap: {
        justifyContent: "center",
        alignItems: "center",
    },
    chipText: {
        fontFamily: "Aeonik-Regular",
        fontSize: fs(12),
        color: "#0D1F1C",
        flexShrink: 1,
    },
});

export default Sources;