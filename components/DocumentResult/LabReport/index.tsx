import { LabReportDocument, LabTest } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FieldRows from "../FieldRows";
import LabTests from "../LabTests";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    document: LabReportDocument;
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
    const meta = document.document_metadata;

    return (
        <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bottomOffset={scale(80)}
        >
            <View style={styles.div}>
                <Title
                    title={document.title}
                    type={document.type}
                    isEditable={isEditable}
                    onTitleChange={onChangeTitle}
                />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name, key: "patient_name" },
                        { icon: "home", label: "Lab", value: meta.lab_name, key: "lab_name" },
                        { icon: "activity", label: "Referred by", value: meta.referred_by, key: "referred_by" },
                        { icon: "calendar", label: "Date", value: meta.date, key: "date" },
                    ]}
                    isEditable={isEditable}
                    onValueChange={onFieldValueChange}
                />
            </View>

            <LabTests
                tests={meta.tests}
                isEditable={isEditable}
                onAddTest={onAddTest}
                onChangeTest={onChangeTest}
                onRemoveTest={onRemoveTest}
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

export default LabReport;