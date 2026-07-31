import { UploadedRadiologyReportDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../../DocumentResult/FieldRows";
import NotesAndTags from "../../DocumentResult/NotesandTags";
import ProseBlock from "../../DocumentResult/ProseBlock";
import Title from "../../DocumentResult/Title";
import DocumentHero from "../DocumentHero";

type Props = {
    document: UploadedRadiologyReportDocument;
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

                <View style={styles.BelowDiv}>
                    <Title
                        title={document.title}
                        type={document.type}
                        isEditable={isEditable}
                        onTitleChange={onChangeTitle}
                    />
                    <FieldRows
                        items={[
                            { icon: "user", label: "Patient", value: meta.patient_name ?? undefined, key: "patient_name" },
                            { icon: "home", label: "Center", value: meta.center_name ?? undefined, key: "center_name" },
                            { icon: "activity", label: "Referred by", value: meta.referred_by ?? undefined, key: "referred_by" },
                            { icon: "calendar", label: "Date", value: meta.date ?? undefined, key: "date" },
                            { icon: "aperture", label: "Modality", value: meta.modality ?? undefined, key: "modality" },
                            { icon: "crosshair", label: "Body part", value: meta.body_part ?? undefined, key: "body_part" },
                        ]}
                        isEditable={isEditable}
                        onValueChange={onFieldValueChange}
                    />
                </View>
            </View>

            <ProseBlock
                onChangeText={onChangeTextProseBlock}
                label="Findings"
                text={meta.findings ?? undefined}
                isEditable={isEditable}
                type="Radiology Report"
                fieldKey="findings"
            />
            <ProseBlock
                onChangeText={onChangeTextProseBlock}
                label="Impression"
                text={meta.impression ?? undefined}
                isEditable={isEditable}
                type="Radiology Report"
                fieldKey="impression"
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

export default RadiologyReport;