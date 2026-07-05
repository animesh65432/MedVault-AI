import { BillingItem } from "@/types";
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
    isBillingModalVisible: boolean;
    setBillingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onAddItem: (item: BillingItem) => void;
};

const EMPTY: BillingItem = { name: "", price: "" };

const AddBillingModel: React.FC<Props> = ({
    isBillingModalVisible,
    setBillingModalVisible,
    onAddItem,
}) => {
    const [item, setItem] = useState<BillingItem>(EMPTY);

    const update = (field: keyof BillingItem, value: string) =>
        setItem((prev) => ({ ...prev, [field]: value }));

    const close = () => {
        setItem(EMPTY);
        setBillingModalVisible(false);
    };

    const handleSave = () => {
        if (!item.name.trim() || !item.price.trim()) return;
        onAddItem(item);
        setItem(EMPTY);
        setBillingModalVisible(false);
    };

    const isValid = item.name.trim().length > 0 && item.price.trim().length > 0;

    return (
        <Modal visible={isBillingModalVisible} animationType="fade" transparent>
            <Pressable style={styles.backdrop} onPress={close}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Billing Item</Text>
                        <TouchableOpacity onPress={close} hitSlop={8}>
                            <Feather name="x" size={fs(18)} color="#5F5E5A" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        value={item.name}
                        onChangeText={(t) => update("name", t)}
                        placeholder="Item name"
                        placeholderTextColor="#B4B2A9"
                        style={styles.nameInput}
                        autoFocus
                    />

                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Price</Text>
                        <TextInput
                            value={item.price}
                            onChangeText={(t) => update("price", t)}
                            placeholder="0.00"
                            placeholderTextColor="#B4B2A9"
                            style={styles.fieldInput}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={!isValid}
                    >
                        <Text style={styles.saveButtonText}>Add Item</Text>
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
    nameInput: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
    },
    fieldWrap: {
        gap: scale(4),
    },
    fieldLabel: {
        fontSize: fs(10),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color: "#5F5E5A",
    },
    fieldInput: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        backgroundColor: "#F1EFE8",
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        paddingVertical: scale(8),
    },
    saveButton: {
        backgroundColor: "#234338",
        borderRadius: scale(20),
        paddingVertical: scale(12),
        alignItems: "center",
        marginTop: scale(4),
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

export default AddBillingModel;