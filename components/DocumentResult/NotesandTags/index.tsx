import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    notes: string[];
    tags: string[];
};

const NotesAndTags: React.FC<Props> = ({ notes, tags }) => {
    const hasNotes = notes && notes.length > 0;
    const hasTags = tags && tags.length > 0;

    if (!hasNotes && !hasTags) return null;

    return (
        <View style={styles.container}>
            {hasNotes && (
                <View style={styles.block}>
                    <Text style={styles.label}>Important notes</Text>
                    <View style={styles.notesList}>
                        {notes.map((note, index) => (
                            <View key={index} style={styles.noteRow}>
                                <View style={styles.dot} />
                                <Text style={styles.noteText}>{note}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {hasTags && (
                <View style={styles.block}>
                    <Text style={styles.label}>Tags</Text>
                    <View style={styles.tagsRow}>
                        {tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(16),
    },
    block: {
        gap: scale(8),
    },
    label: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    notesList: {
        gap: scale(6),
    },
    noteRow: {
        flexDirection: "row",
        gap: scale(8),
        alignItems: "flex-start",
    },
    dot: {
        width: scale(5),
        height: scale(5),
        borderRadius: scale(3),
        backgroundColor: "#EEF6A2",
        borderWidth: 1,
        borderColor: "#23423B",
        marginTop: scale(6),
    },
    noteText: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        lineHeight: fs(13) * 1.5,
        flex: 1,
    },
    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(6),
    },
    tag: {
        backgroundColor: "#E6F1FB",
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderWidth: 1,
        borderColor: "#B5D4F4",
    },
    tagText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#185FA5",
        textTransform: "lowercase",
    },
});

export default NotesAndTags;