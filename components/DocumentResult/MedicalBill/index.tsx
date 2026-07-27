import DocumentHero from "@/components/DocumentView/DocumentHero";
import { BillingItem, MedicalBillDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Billing from "../Billing";
import FieldRows from "../FieldRows";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    document: MedicalBillDocument;
    isEditable: boolean;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (label: string, value: string) => void;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: (note: string) => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
    onUpdateItem: (index: number, field: keyof BillingItem, value: string) => void;
    onRemoveItem: (index: number) => void;
    onAddItem: (item: BillingItem) => void;
    onUpdateSubtotal: (value: string) => void;
    onUpdateDiscount: (value: string) => void;
    onUpdateTotal: (value: string) => void;
    isPdf: boolean;
    sourceFilePath: string
};

const MedicalBill: React.FC<Props> = ({ isPdf, sourceFilePath, onUpdateTotal, onUpdateSubtotal, onUpdateDiscount, onUpdateItem, onRemoveItem, onAddItem, onUpdateNote, onRemoveNote, onUpdateTag, onRemoveTag, onAddTag, onAddNote, onFieldValueChange, onChangeTitle, document, isEditable }) => {
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
                <DocumentHero
                    isPdf={isPdf}
                    sourceFilePath={sourceFilePath}
                />
                <Title
                    title={document.title}
                    type={document.type}
                    isEditable={isEditable}
                    onTitleChange={onChangeTitle}
                />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name, key: "patient_name" },
                        { icon: "home", label: "Hospital", value: meta.hospital_name, key: "hospital_name" },
                        { icon: "calendar", label: "Date", value: meta.date, key: "date" },
                    ]}
                    isEditable={isEditable}
                    onValueChange={onFieldValueChange}
                />
            </View>
            <Billing
                items={meta.billing_items}
                subtotal={meta.subtotal}
                discount={meta.discount}
                total={meta.total_amount}
                isEditable={isEditable}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
                onAddItem={onAddItem}
                onUpdateSubtotal={onUpdateSubtotal}
                onUpdateDiscount={onUpdateDiscount}
                onUpdateTotal={onUpdateTotal}
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

export default MedicalBill;