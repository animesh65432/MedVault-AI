import { GenericDocument, Medicine } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { ScrollView, View } from "react-native";
import FieldRows from "../FieldRows";
import Medicines from "../Medicines";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    document: GenericDocument;
    activeReminders: Set<number>;
    onToggleReminder: (index: number, medicine: Medicine) => void;
};

const Generic: React.FC<Props> = ({
    document,
    activeReminders,
    onToggleReminder,
}) => {
    const meta = document.document_metadata;

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
                        { icon: "calendar", label: "Date", value: meta.date },
                    ]}
                />
            </View>

            <Medicines
                medicines={meta.medicines}
                activeReminders={activeReminders}
                onToggleReminder={onToggleReminder}
            />

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

export default Generic;