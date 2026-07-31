import { LabTest, Medicine as MedicineType, Reminder, UploadedDischargeSummaryDocument } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import BulletList from "../../DocumentResult/Bulletlist";
import FieldRows from "../../DocumentResult/FieldRows";
import LabTests from "../../DocumentResult/LabTests";
import Medicines from "../../DocumentResult/Medicines";
import NotesAndTags from "../../DocumentResult/NotesandTags";
import ProseBlock from "../../DocumentResult/ProseBlock";
import Title from "../../DocumentResult/Title";
import DocumentHero from "../DocumentHero";

type Props = {
    document: UploadedDischargeSummaryDocument;
    isEditable: boolean;
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
    onChangeTest: (index: number, patch: Partial<LabTest>) => void;
    onRemoveTest: (index: number) => void;
    onAddTest: (test: LabTest) => void;
    initialTitle: string;
    onAddReminder: (index: number, reminder: Reminder) => void;
    onRemoveReminder: (medicineIndex: number, reminderIndex: number) => void
    onChangeTextProseBlock: (type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter", label: string, value: string) => void;
};

const DischargeSummary: React.FC<Props> = ({
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
    onChangeTest,
    onRemoveTest,
    onAddTest,
    initialTitle,
    onAddReminder,
    onRemoveReminder,
    onChangeTextProseBlock
}) => {
    const meta = document;
    const hasStayDates = meta.admission_date || meta.discharge_date;

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
                            { icon: "home", label: "Hospital", value: meta.hospital_name ?? undefined, key: "hospital_name" },
                        ]}
                        isEditable={isEditable}
                        onValueChange={onFieldValueChange}
                    />
                </View>
            </View>


            {(hasStayDates || isEditable) && (
                <View style={styles.stayBand}>
                    <View style={styles.stayCol}>
                        <Feather name="log-in" size={fs(14)} color="#23423B" />
                        <Text style={styles.stayLabel}>Admitted</Text>
                        {isEditable ? (
                            <TextInput
                                value={meta.admission_date ?? ""}
                                style={styles.stayDateInput}
                                placeholder="—"
                                placeholderTextColor="#7C948B"
                            />
                        ) : (
                            <Text style={styles.stayDate}>{meta.admission_date || "—"}</Text>
                        )}
                    </View>
                    <View style={styles.stayDivider} />
                    <View style={styles.stayCol}>
                        <Feather name="log-out" size={fs(14)} color="#23423B" />
                        <Text style={styles.stayLabel}>Discharged</Text>
                        {isEditable ? (
                            <TextInput
                                value={meta.discharge_date ?? ""}
                                style={styles.stayDateInput}
                                placeholder="—"
                                placeholderTextColor="#7C948B"
                            />
                        ) : (
                            <Text style={styles.stayDate}>{meta.discharge_date || "—"}</Text>
                        )}
                    </View>
                </View>
            )}

            <ProseBlock
                label="Diagnosis"
                text={meta.diagnosis ?? undefined}
                isEditable={isEditable}
                type="Discharge Summary"
                onChangeText={onChangeTextProseBlock}
                fieldKey="diagnosis"
            />

            <BulletList
                isEditable={isEditable}
                label="Procedures"
                items={meta.procedures}
            />

            <Medicines
                initialTitle={initialTitle}
                medicines={meta.medicines}
                isEditable={isEditable}
                onRemoveMedicine={onRemoveMedicine}
                onUpdateMedicine={onUpdateMedicine}
                onAddMedicine={onAddMedicine}
                onAddReminder={onAddReminder}
                onRemoveReminder={onRemoveReminder}
            />

            <LabTests
                tests={meta.tests}
                isEditable={isEditable}
                onChangeTest={onChangeTest}
                onRemoveTest={onRemoveTest}
                onAddTest={onAddTest}
            />

            <ProseBlock
                label="Follow-up"
                text={meta.follow_up ?? undefined}
                isEditable={isEditable}
                type="Discharge Summary"
                onChangeText={onChangeTextProseBlock}
                fieldKey="follow_up"
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

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        gap: scale(20),
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
        paddingBottom: scale(40),
    },
    stayBand: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E5F0EB",
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: "#D1E0DC",
        paddingVertical: scale(12),
    },
    stayCol: {
        flex: 1,
        alignItems: "center",
        gap: scale(4),
    },
    stayDivider: {
        width: 1,
        height: scale(36),
        backgroundColor: "#D1E0DC",
    },
    stayLabel: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Regular",
        color: "#5F5E5A",
    },
    stayDate: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    stayDateInput: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
        padding: 0,
        textAlign: "center",
        minWidth: scale(70),
    },
    div: {
        borderRadius: scale(30),
        gap: scale(10),
        backgroundColor: "#F7F9F8",
    },
    BelowDiv: {
        padding: scale(16),
    },
});

export default DischargeSummary;