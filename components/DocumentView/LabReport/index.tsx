import { LabTest, UploadedLabReportDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../../DocumentResult/FieldRows";
import LabTests from "../../DocumentResult/LabTests";
import NotesAndTags from "../../DocumentResult/NotesandTags";
import Title from "../../DocumentResult/Title";
import DocumentHero from "../DocumentHero";

type Props = {
    document: UploadedLabReportDocument;
    isEditable: boolean;
    onChangeTitle: (value: string) => void;
    onFieldValueChange: (label: string, value: string) => void;
    onUpdateNote: (index: number, value: string) => void;
    onRemoveNote: (index: number) => void;
    onAddNote: (note: string) => void;
    onUpdateTag: (index: number, value: string) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: (value: string) => void;
    onChangeTest: (index: number, patch: Partial<LabTest>) => void;
    onRemoveTest: (index: number) => void;
    onAddTest: (test: LabTest) => void;
};

const LabReport: React.FC<Props> = ({ onAddTest, onRemoveTest, onChangeTest, onUpdateNote, onRemoveNote, onUpdateTag, onRemoveTag, onAddTag, onAddNote, onFieldValueChange, onChangeTitle, document, isEditable }) => {
    const meta = document;

    return (
        <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bottomOffset={scale(80)}
        >
            <View style={styles.div}>
                <DocumentHero
                    isPdf={document.IsPdf}
                    sourceFilePath={document.SourceFilePath}
                />
                <View
                    style={styles.BelowDiv}
                >
                    <Title
                        title={document.title}
                        type={document.type}
                        isEditable={isEditable}
                        onTitleChange={onChangeTitle}
                    />

                    <FieldRows
                        items={[
                            { icon: "user", label: "Patient", value: meta.patient_name ?? undefined, key: "patient_name" },
                            { icon: "home", label: "Lab", value: meta.lab_name ?? undefined, key: "lab_name" },
                            { icon: "activity", label: "Referred by", value: meta.referred_by ?? undefined, key: "referred_by" },
                            { icon: "calendar", label: "Date", value: meta.date ?? undefined, key: "date" },
                        ]}
                        isEditable={isEditable}
                        onValueChange={onFieldValueChange}
                    />
                </View>
            </View>

            <LabTests
                tests={meta.tests}
                isEditable={isEditable}
                onAddTest={onAddTest}
                onChangeTest={onChangeTest}
                onRemoveTest={onRemoveTest}
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

export default LabReport;