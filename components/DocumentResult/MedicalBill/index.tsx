import { MedicalBillDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from "react";
import { ScrollView, View } from "react-native";
import Billing from "../Billing";
import FieldRows from "../FieldRows";
import NotesAndTags from "../NotesandTags";
import Title from "../Title";

type Props = {
    document: MedicalBillDocument;
};

const MedicalBill: React.FC<Props> = ({ document }) => {
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
                <Title title={document.title} doc_type={document.doc_type} />

                <FieldRows
                    items={[
                        { icon: "user", label: "Patient", value: meta.patient_name },
                        { icon: "home", label: "Hospital", value: meta.hospital_name },
                        { icon: "calendar", label: "Date", value: meta.date },
                    ]}
                />
            </View>

            <Billing
                items={meta.billing_items}
                subtotal={meta.subtotal}
                discount={meta.discount}
                total={meta.total_amount}
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

export default MedicalBill;