import { Medicine as MedicineType, PrescriptionDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../FieldRows";
import Medicines from "../Medicines";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    isEditable: boolean
    document: PrescriptionDocument;
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
    onAddMedicine
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
                    isEditable={isEditable}
                    title={document.title}
                    type={document.type}
                    onTitleChange={onChangeTitle}
                />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name, key: "patient_name" },
                        { icon: "activity", label: "Doctor", value: meta.doctor_name, key: "doctor_name" },
                        { icon: "home", label: "Clinic", value: meta.clinic_name, key: "clinic_name" },
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
                onAddMedicine={onAddMedicine}
            />
            <NotesAndTags
                notes={meta.important_notes}
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
        backgroundColor: "#234338",
        borderRadius: scale(16),
        padding: scale(16),
        gap: scale(10)
    },
};

export default Prescription;