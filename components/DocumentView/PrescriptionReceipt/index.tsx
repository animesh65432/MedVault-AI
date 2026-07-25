import { BillingItem, Medicine as MedicineType, Reminder, UploadedPrescriptionReceiptDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Billing from "../../DocumentResult/Billing";
import FieldRows from "../../DocumentResult/FieldRows";
import Medicines from "../../DocumentResult/Medicines";
import NotesAndTags from "../../DocumentResult/NotesandTags";
import Title from "../../DocumentResult/Title";
import DocumentHero from "../DocumentHero";

type Props = {
    isEditable: boolean
    document: UploadedPrescriptionReceiptDocument;
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
    onUpdateItem: (index: number, field: keyof BillingItem, value: string) => void;
    onRemoveItem: (index: number) => void;
    onAddItem: (item: BillingItem) => void;
    onUpdateSubtotal: (value: string) => void;
    onUpdateDiscount: (value: string) => void;
    onUpdateTotal: (value: string) => void;
    initialTitle: string;
    onAddReminder: (index: number, reminder: Reminder) => void;
    onRemoveReminder: (medicineIndex: number, reminderIndex: number) => void
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
    onAddMedicine,
    onUpdateItem,
    onRemoveItem,
    onAddItem,
    onUpdateSubtotal,
    onUpdateDiscount,
    onUpdateTotal,
    initialTitle,
    onRemoveReminder,
    onAddReminder
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
                <Title
                    title={document.title}
                    type={document.type}
                    isEditable={isEditable}
                    onTitleChange={onChangeTitle}
                />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name ?? undefined, key: "patient_name" },
                        { icon: "calendar", label: "Date", value: meta.date ?? undefined, key: "date" },
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
                initialTitle={initialTitle}
                onAddReminder={onAddReminder}
                onRemoveReminder={onRemoveReminder}
            />
            <Billing
                items={meta.billing_items}
                total={meta.total_amount ?? undefined}
                isEditable={isEditable}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
                onAddItem={onAddItem}
                onUpdateSubtotal={onUpdateSubtotal}
                onUpdateDiscount={onUpdateDiscount}
                onUpdateTotal={onUpdateTotal}
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
        borderRadius: scale(16),
        gap: scale(10)
    },
};

export default PrescriptionReceipt;