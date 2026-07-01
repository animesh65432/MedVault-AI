import { RadiologyReportDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { ScrollView, View } from "react-native";
import FieldRows from "../FieldRows";
import NotesAndTags from "../NotesandTags";
import ProseBlock from "../ProseBlock";
import Title from "../Title";

type Props = {
    document: RadiologyReportDocument;
};

const RadiologyReport: React.FC<Props> = ({ document }) => {
    const meta = document.document_metadata;

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View
                style={styles.div}
            >
                <Title title={document.title} tpye={document.doc_type} />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name },
                        { icon: "home", label: "Center", value: meta.center_name },
                        { icon: "activity", label: "Referred by", value: meta.referred_by },
                        { icon: "calendar", label: "Date", value: meta.date },
                        { icon: "aperture", label: "Modality", value: meta.modality },
                        { icon: "crosshair", label: "Body part", value: meta.body_part },
                    ]}
                />
            </View>

            <ProseBlock label="Findings" text={meta.findings} />
            <ProseBlock label="Impression" text={meta.impression} />

            <NotesAndTags notes={meta.important_notes} tags={meta.tags} />
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

export default RadiologyReport;