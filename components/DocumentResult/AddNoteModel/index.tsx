import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (note: string) => void;
};

const AddNoteModel: React.FC<Props> = ({ visible, onClose, onAdd }) => {
    const [note, setNote] = useState("");

    const close = () => {
        setNote("");
        onClose();
    };

    const handleSave = () => {
        const trimmed = note.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setNote("");
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <Pressable style={styles.backdrop} onPress={close}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Note</Text>
                        <TouchableOpacity onPress={close} hitSlop={8}>
                            <Feather name="x" size={fs(18)} color="#5F5E5A" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="Add a note"
                        placeholderTextColor="#B4B2A9"
                        style={styles.input}
                        multiline
                        autoFocus
                    />

                    <TouchableOpacity
                        style={[styles.saveButton, !note.trim() && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!note.trim()}
                    >
                        <Text style={styles.saveButtonText}>Add Note</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(13,31,28,0.4)",
        justifyContent: "space-around",
    },
    sheet: {
        backgroundColor: "#FAFAF8",
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        padding: scale(16),
        gap: scale(12),
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    input: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        minHeight: scale(80),
        textAlignVertical: "top",
    },
    saveButton: {
        backgroundColor: "#234338",
        borderRadius: scale(20),
        paddingVertical: scale(12),
        alignItems: "center",
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#EEF6A2",
    },
});

export default AddNoteModel;