import { RadiologyReportDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../FieldRows";
import NotesAndTags from "../NotesandTags";
import ProseBlock from "../ProseBlock";
import Title from "../Title";

type Props = {
    document: RadiologyReportDocument;
    isEditable: boolean;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (label: string, value: string) => void;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: (note: string) => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
    onChangeTextProseBlock: (type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter", label: string, value: string) => void;
};

const RadiologyReport: React.FC<Props> = ({ onChangeTextProseBlock, onUpdateNote, onRemoveNote, onUpdateTag, onRemoveTag, onAddTag, onAddNote, onFieldValueChange, onChangeTitle, isEditable, document }) => {
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
                        { icon: "home", label: "Center", value: meta.center_name, key: "center_name" },
                        { icon: "activity", label: "Referred by", value: meta.referred_by, key: "referred_by" },
                        { icon: "calendar", label: "Date", value: meta.date, key: "date" },
                        { icon: "aperture", label: "Modality", value: meta.modality, key: "modality" },
                        { icon: "crosshair", label: "Body part", value: meta.body_part, key: "body_part" },
                    ]}
                    isEditable={isEditable}
                    onValueChange={onFieldValueChange}
                />
            </View>

            <ProseBlock
                onChangeText={onChangeTextProseBlock}
                label="Findings"
                text={meta.findings}
                isEditable={isEditable}
                type="Radiology Report"
                fieldKey="findings"
            />
            <ProseBlock
                onChangeText={onChangeTextProseBlock}
                label="Impression"
                text={meta.impression}
                isEditable={isEditable}
                type="Radiology Report"
                fieldKey="impression"
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

export default RadiologyReport;