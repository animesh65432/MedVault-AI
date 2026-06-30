import { PrescriptionDocument } from "@/types";
import { scale } from "@/utils/scale";
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MediCines from "../Medicines";
import Title from "../Title";
import Information from "./Information";
;

type Props = {
    Document: PrescriptionDocument
}

const Prescription: React.FC<Props> = ({ Document }) => {
    return (
        <ScrollView style={styles.container}>
            <Title
                doc_type={Document.doc_type}
                title={Document.title}
            />
            <Information
                date={Document.document_metadata.date}
                patient_name={Document.document_metadata.patient_name}
                clinic_name={Document.document_metadata.clinic_name}
                doctor_name={Document.document_metadata.doctor_name}
            />
            <MediCines
                medicines={Document.document_metadata.medicines}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
        marginTop: scale(30),
        gap: scale(15)
    },
    Description: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        justifyContent: "space-between"
    },
    DescriptionDiv: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
    }
})
export default Prescription