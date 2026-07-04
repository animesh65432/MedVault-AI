import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AddNoteModel from "../AddNoteModel";

type Props = {
    notes: string[];
    tags: string[];
    isEditable: boolean;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: () => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
};

const NotesAndTags: React.FC<Props> = ({
    isEditable,
    notes,
    tags,
    onUpdateNote,
    onRemoveNote,
    onAddNote,
    onUpdateTag,
    onRemoveTag,
    onAddTag,
}) => {
    const [newTag, setNewTag] = useState("");
    const [ShowNoteModel, SetShowNoteModel] = useState<boolean>(false)
    const hasNotes = notes && notes.length > 0;
    const hasTags = tags && tags.length > 0;

    if (!hasNotes && !hasTags && !isEditable) return null;

    const submitNewTag = () => {
        const trimmed = newTag.trim();
        if (trimmed) {
            onAddTag(trimmed);
            setNewTag("");
        }
    };

    return (
        <View style={styles.container}>
            {(hasNotes || isEditable) && (
                <View style={styles.block}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Important notes</Text>
                        {isEditable && (
                            <TouchableOpacity onPress={() => SetShowNoteModel(true)} hitSlop={8} style={styles.addRow}>
                                <Feather name="plus" size={fs(12)} color="#234338" />
                                <Text style={styles.addRowText}>Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.notesList}>
                        {notes.map((note, index) => (
                            <View key={index} style={styles.noteRow}>
                                <View style={styles.dot} />
                                {isEditable ? (
                                    <TextInput
                                        value={note}
                                        onChangeText={(text) => onUpdateNote?.(index, text)}
                                        style={styles.noteInput}
                                        multiline
                                        placeholder="Add a note"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                ) : (
                                    <Text style={styles.noteText}>{note}</Text>
                                )}
                                {isEditable && (
                                    <TouchableOpacity onPress={() => onRemoveNote?.(index)} hitSlop={8}>
                                        <Feather name="x" size={fs(14)} color="#B3261E" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {(hasTags || isEditable) && (
                <View style={styles.block}>
                    <Text style={styles.label}>Tags</Text>
                    <View style={styles.tagsRow}>
                        {tags.map((tag, index) =>
                            isEditable ? (
                                <View key={index} style={styles.tagEditable}>
                                    <TextInput
                                        value={tag}
                                        onChangeText={(text) => onUpdateTag?.(index, text)}
                                        style={styles.tagInput}
                                    />
                                    <TouchableOpacity onPress={() => onRemoveTag?.(index)} hitSlop={6}>
                                        <Feather name="x" size={fs(12)} color="#185FA5" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            )
                        )}
                        {isEditable && (
                            <View style={styles.tagAddWrap}>
                                <TextInput
                                    value={newTag}
                                    onChangeText={setNewTag}
                                    onSubmitEditing={submitNewTag}
                                    onBlur={submitNewTag}
                                    placeholder="+ new tag"
                                    placeholderTextColor="#8FAFCB"
                                    style={styles.tagAddInput}
                                    returnKeyType="done"
                                />
                            </View>
                        )}
                    </View>
                </View>
            )}
            <AddNoteModel
                visible={ShowNoteModel}
                onClose={() => SetShowNoteModel(false)}
                onAdd={(note) => {
                    onAddNote();
                    SetShowNoteModel(false);
                }}
            />
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
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    addRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
    },
    addRowText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
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
    noteInput: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        lineHeight: fs(13) * 1.5,
        flex: 1,
        padding: 0,
    },
    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scale(6),
        alignItems: "center",
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
    tagEditable: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
        backgroundColor: "#E6F1FB",
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderWidth: 1,
        borderColor: "#B5D4F4",
    },
    tagInput: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#185FA5",
        textTransform: "lowercase",
        padding: 0,
        minWidth: scale(30),
    },
    tagAddWrap: {
        backgroundColor: "#F1EFE8",
        borderRadius: scale(20),
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#B4B2A9",
    },
    tagAddInput: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#5F5E5A",
        padding: 0,
        minWidth: scale(60),
    },
});

export default NotesAndTags;