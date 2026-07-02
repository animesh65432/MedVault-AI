import { LabReportDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { ScrollView, View } from "react-native";
import FieldRows from "../FieldRows";
import LabTests from "../LabTests";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    document: LabReportDocument;
    isEditable: boolean
};

const LabReport: React.FC<Props> = ({ document, isEditable }) => {
    const meta = document.document_metadata;

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.div}>
                <Title
                    title={document.title}
                    type={document.type}
                    isEditable={isEditable}
                />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name },
                        { icon: "home", label: "Lab", value: meta.lab_name },
                        { icon: "activity", label: "Referred by", value: meta.referred_by },
                        { icon: "calendar", label: "Date", value: meta.date },
                    ]}
                    isEditable={isEditable}
                />
            </View>

            <LabTests
                tests={meta.tests}
                isEditable={isEditable}
            />

            <NotesAndTags
                notes={meta.important_notes}
                tags={meta.tags}
                isEditable={isEditable}
            />
        </ScrollView>
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