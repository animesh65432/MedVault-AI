import { DischargeSummaryDocument, Medicine } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BulletList from "../Bulletlist";
import FieldRows from "../FieldRows";
import LabTests from "../LabTests";
import Medicines from "../Medicines";
import NotesAndTags from "../NotesandTags";
import ProseBlock from "../ProseBlock";
import Title from "../Title";

type Props = {
    document: DischargeSummaryDocument;
    activeReminders: Set<number>;
    onToggleReminder: (index: number, medicine: Medicine) => void;
};

const DischargeSummary: React.FC<Props> = ({
    document,
    activeReminders,
    onToggleReminder,
}) => {
    const meta = document.document_metadata;
    const hasStayDates = meta.admission_date || meta.discharge_date;

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.div}>
                <Title title={document.title} tpye={document.doc_type} />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name },
                        { icon: "home", label: "Hospital", value: meta.hospital_name },
                    ]}
                />
            </View>

            {hasStayDates && (
                <View style={styles.stayBand}>
                    <View style={styles.stayCol}>
                        <Feather name="log-in" size={fs(14)} color="#23423B" />
                        <Text style={styles.stayLabel}>Admitted</Text>
                        <Text style={styles.stayDate}>
                            {meta.admission_date || "—"}
                        </Text>
                    </View>
                    <View style={styles.stayDivider} />
                    <View style={styles.stayCol}>
                        <Feather name="log-out" size={fs(14)} color="#23423B" />
                        <Text style={styles.stayLabel}>Discharged</Text>
                        <Text style={styles.stayDate}>
                            {meta.discharge_date || "—"}
                        </Text>
                    </View>
                </View>
            )}

            <ProseBlock label="Diagnosis" text={meta.diagnosis} />

            <BulletList label="Procedures" items={meta.procedures} />

            <Medicines
                medicines={meta.medicines}
                activeReminders={activeReminders}
                onToggleReminder={onToggleReminder}
            />

            <LabTests tests={meta.tests} />

            <ProseBlock label="Follow-up" text={meta.follow_up} />

            <NotesAndTags notes={meta.important_notes} tags={meta.tags} />
        </ScrollView>
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
    div: {
        backgroundColor: "#234338",
        borderRadius: scale(16),
        padding: scale(16),
        gap: scale(10)
    },
});

export default DischargeSummary;