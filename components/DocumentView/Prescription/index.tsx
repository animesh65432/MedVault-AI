import { Medicine as MedicineType, Reminder, UploadedPrescriptionDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../../DocumentResult/FieldRows";
import Medicines from "../../DocumentResult/Medicines";
import NotesAndTags from "../../DocumentResult/NotesandTags";
import Title from "../../DocumentResult/Title";
import DocumentHero from "../DocumentHero";

type Props = {
    isEditable: boolean
    document: UploadedPrescriptionDocument;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (field: string, value: string) => void;
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
    onRemoveReminder: (medicineIndex: number, reminderIndex: number) => void;
};

const Prescription: React.FC<Props> = ({
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
    onUpdateMedicine,
    onRemoveMedicine,
    onAddMedicine,
    initialTitle,
    onAddReminder,
    onRemoveReminder
}) => {
    const meta = document;
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
                <DocumentHero
                    isPdf={document.IsPdf}
                    sourceFilePath={document.SourceFilePath}
                />
                <View
                    style={styles.BelowDiv}
                >
                    <Title
                        isEditable={isEditable}
                        title={document.title}
                        type={document.type}
                        onTitleChange={onChangeTitle}
                    />
                    <FieldRows
                        items={[
                            { icon: "user", label: "Patient", value: meta.patient_name ?? undefined, key: "patient_name" },
                            { icon: "activity", label: "Doctor", value: meta.doctor_name ?? undefined, key: "doctor_name" },
                            { icon: "home", label: "Clinic", value: meta.clinic_name ?? undefined, key: "clinic_name" },
                            { icon: "calendar", label: "Date", value: meta.date ?? undefined, key: "date" },
                        ]}
                        isEditable={isEditable}
                        onValueChange={onFieldValueChange}
                    />
                </View>
            </View>
            <Medicines
                initialTitle={initialTitle}
                medicines={meta.medicines}
                isEditable={isEditable}
                onUpdateMedicine={onUpdateMedicine}
                onRemoveMedicine={onRemoveMedicine}
                onAddMedicine={onAddMedicine}
                onAddReminder={onAddReminder}
                onRemoveReminder={onRemoveReminder}
            />
            <NotesAndTags
                notes={meta.notes}
                tags={meta.tags}
                isEditable={isEditable}
                onUpdateNote={onUpdateNote}
                onRemoveNote={onRemoveNote}
                onAddNote={onAddNote}
                onUpdateTag={onUpdateTag}
                onRemoveTag={onRemoveTag}
                onAddTag={onAddTag}
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
        borderRadius: scale(30),
        gap: scale(10),
        backgroundColor: "#F7F9F8",
    },
    BelowDiv: {
        padding: scale(16),
    },
};

export default Prescription;