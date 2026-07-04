import { Medicine as MedicineType, PrescriptionReceiptDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Billing from "../Billing";
import FieldRows from "../FieldRows";
import Medicines from "../Medicines";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    isEditable: boolean
    document: PrescriptionReceiptDocument;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (label: string, value: string) => void;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: () => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
    onUpdateMedicine: (index: number, field: keyof MedicineType, value: string) => void;
    onRemoveMedicine: (index: number) => void;
};

const PrescriptionReceipt: React.FC<Props> = ({
    document,
    isEditable,
    onChangeTitle,
    onFieldValueChange,
    onUpdateNote,
    onRemoveNote,
    onUpdateTag,
    onRemoveTag,
    onAddTag,
    onAddNote,
    onUpdateMedicine,
    onRemoveMedicine,
}) => {
    const meta = document.document_metadata;

    return (
        <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bottomOffset={scale(80)}
        >
            <View
                style={styles.div}
            >
                <Title
                    title={document.title}
                    type={document.type}
                    isEditable={isEditable}
                    onTitleChange={onChangeTitle}
                />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name, key: "patient_name" },
                        { icon: "calendar", label: "Date", value: meta.date, key: "date" },
                    ]}
                    isEditable={isEditable}
                    onValueChange={onFieldValueChange}
                />
            </View>

            <Medicines
                medicines={meta.medicines}
                isEditable={isEditable}
                onUpdateMedicine={onUpdateMedicine}
                onRemoveMedicine={onRemoveMedicine}
            />
            <Billing
                items={meta.billing_items}
                total={meta.total_amount}
                isEditable={isEditable}
            />
            <NotesAndTags
                notes={meta.important_notes}
                tags={meta.tags}
                isEditable={isEditable}
                onUpdateNote={onUpdateNote}
                onRemoveNote={onRemoveNote}
                onUpdateTag={onUpdateTag}
                onRemoveTag={onRemoveTag}
                onAddTag={onAddTag}
                onAddNote={onAddNote}
            />
        </KeyboardAwareScrollView>
    );
};

const styles = {
    scroll: {
        flex: 1,
    },
    content: {
        gap: scale(20),
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
        paddingBottom: scale(40),
    },
    div: {
        backgroundColor: "#234338",
        borderRadius: scale(16),
        padding: scale(16),
        gap: scale(10)
    },
};

export default PrescriptionReceipt;