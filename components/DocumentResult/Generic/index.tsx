import DocumentHero from "@/components/DocumentView/DocumentHero";
import { GenericDocument, Medicine as MedicineType, Reminder } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../FieldRows";
import Medicines from "../Medicines";
import NotesAndTags from "../NotesandTags";
import ProseBlock from "../ProseBlock";
import Title from "../Title";

type Props = {
    isEditable: boolean;
    document: GenericDocument;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (label: string, value: string) => void;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: (note: string) => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
    onUpdateMedicine: (index: number, field: keyof MedicineType, value: string) => void;
    onRemoveMedicine: (index: number) => void;
    onAddMedicine: (medicine: MedicineType) => void;
    initialTitle: string;
    onAddReminder: (index: number, reminder: Reminder) => void;
    onRemoveReminder: (medicineIndex: number, reminderIndex: number) => void
    onChangeTextProseBlock: (type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter", label: string, value: string) => void;
    IsShowDocument?: boolean;
    isPdf: boolean
    sourceFilePath: string
};

const Generic: React.FC<Props> = ({
    document,
    isEditable,
    onChangeTitle,
    onFieldValueChange,
    onUpdateNote,
    onRemoveNote,
    onAddNote,
    onUpdateTag,
    onRemoveTag,
    onAddTag,
    onRemoveMedicine,
    onUpdateMedicine,
    onAddMedicine,
    initialTitle,
    onAddReminder,
    onRemoveReminder,
    IsShowDocument = false,
    isPdf,
    sourceFilePath
}) => {
    const meta = document.document_metadata;
    return (
        <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bottomOffset={scale(80)}
        >
            <View style={styles.div}>
                <DocumentHero
                    isPdf={isPdf}
                    sourceFilePath={sourceFilePath}
                />
                <Title
                    onTitleChange={onChangeTitle}
                    title={document.title}
                    type={document.type}
                    isEditable={isEditable}
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
            <ProseBlock
                onChangeText={onFieldValueChange}
                label="Summary"
                text={meta.summary}
                isEditable={isEditable}
                type="Generic"
                fieldKey="summary"
            />
            <Medicines
                medicines={meta.medicines}
                isEditable={isEditable}
                onRemoveMedicine={onRemoveMedicine}
                onUpdateMedicine={onUpdateMedicine}
                onAddMedicine={onAddMedicine}
                initialTitle={initialTitle}
                onAddReminder={onAddReminder}
                onRemoveReminder={onRemoveReminder}
                IsShowDocument={IsShowDocument}
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
        borderRadius: scale(16),
        padding: scale(16),
        gap: scale(10)
    },
};

export default Generic;