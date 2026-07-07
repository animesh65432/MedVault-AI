import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
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
    onAdd: (tag: string) => void;
};

const AddTagModel: React.FC<Props> = ({ visible, onClose, onAdd }) => {
    const [tag, setTag] = useState("");

    const handleClose = () => {
        setTag("");
        onClose();
    };

    const handleAdd = () => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setTag("");
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <Pressable style={styles.backdrop} onPress={handleClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.avoider}
                >
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.handle} />
                        <View style={styles.headerRow}>
                            <Text style={styles.title}>Add tag</Text>
                            <TouchableOpacity onPress={handleClose} hitSlop={8}>
                                <Feather name="x" size={fs(18)} color="#5F5E5A" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            value={tag}
                            onChangeText={setTag}
                            placeholder="e.g. follow-up"
                            placeholderTextColor="#B4B2A9"
                            style={styles.input}
                            autoFocus
                            returnKeyType="done"
                            onSubmitEditing={handleAdd}
                        />

                        <TouchableOpacity
                            style={[styles.addButton, !tag.trim() && styles.addButtonDisabled]}
                            onPress={handleAdd}
                            disabled={!tag.trim()}
                        >
                            <Text style={styles.addButtonText}>Add tag</Text>
                        </TouchableOpacity>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "space-around",
    },
    avoider: {
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        paddingHorizontal: scale(20),
        paddingTop: scale(10),
        paddingBottom: scale(28),
        gap: scale(14),
    },
    handle: {
        width: scale(36),
        height: scale(4),
        borderRadius: scale(2),
        backgroundColor: "#E2E0D8",
        alignSelf: "center",
        marginBottom: scale(4),
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: fs(15),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E0D8",
        borderRadius: scale(12),
        paddingHorizontal: scale(14),
        paddingVertical: scale(12),
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
    },
    addButton: {
        backgroundColor: "#234338",
        borderRadius: scale(12),
        paddingVertical: scale(14),
        alignItems: "center",
    },
    addButtonDisabled: {
        backgroundColor: "#B7C4BE",
    },
    addButtonText: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#EEF6A2",
    },
});

export default AddTagModel;