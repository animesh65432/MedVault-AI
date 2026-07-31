import { Medicine as MedicineType, Reminder, UploadedReferralLetterDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../../DocumentResult/FieldRows";
import Medicines from "../../DocumentResult/Medicines";
import NotesAndTags from "../../DocumentResult/NotesandTags";
import ProseBlock from "../../DocumentResult/ProseBlock";
import Title from "../../DocumentResult/Title";
import DocumentHero from "../DocumentHero";

type Props = {
    document: UploadedReferralLetterDocument;
    isEditable: boolean;
    onUpdateMedicine: (index: number, field: keyof MedicineType, value: string) => void;
    onRemoveMedicine: (index: number) => void;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (label: string, value: string) => void;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: (note: string) => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
    onAddMedicine: (medicine: MedicineType) => void;
    initialTitle: string;
    onAddReminder: (index: number, reminder: Reminder) => void;
    onRemoveReminder: (medicineIndex: number, reminderIndex: number) => void;
    onChangeTextProseBlock: (type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter", label: string, value: string) => void;
};

const ReferralLetter: React.FC<Props> = ({
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
    onChangeTextProseBlock
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
                            { icon: "user-check", label: "Referred to", value: meta.referred_to ?? undefined, key: "referred_to" },
                            { icon: "calendar", label: "Date", value: meta.date ?? undefined, key: "date" },
                        ]}
                        isEditable={isEditable}
                        onValueChange={onFieldValueChange}
                    />
                </View>
            </View>

            <ProseBlock
                label="Reason for referral"
                text={meta.reason_for_referral ?? undefined}
                isEditable={isEditable}
                type="Referral Letter"
                onChangeText={onChangeTextProseBlock}
                fieldKey="reason_for_referral"
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
            />

            <NotesAndTags
                notes={meta.notes}
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
        borderRadius: scale(30),
        gap: scale(10),
        backgroundColor: "#F7F9F8",
    },
    BelowDiv: {
        padding: scale(16),
    },
};

export default ReferralLetter;