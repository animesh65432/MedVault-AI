import { PrescriptionDocument } from "@/types";
import { scale } from "@/utils/scale";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Title from "../Title";

type Props = {
    Document: PrescriptionDocument
}

const Prescription: React.FC<Props> = ({ Document }) => {
    return (
        <View style={styles.container}>
            <Title
                doc_type={Document.doc_type}
                title={Document.title}
            />
            <View style={styles.Description}>
                <View>
                    <FontAwesome5
                        name="user"
                        size={scale(20)}
                        color="#234338"
                    />
                    <Text>{Document.document_metadata.patient_name}</Text>
                </View>
                <View>
                    <Text>{Document.document_metadata.clinic_name.toLocaleLowerCase()}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
        marginTop: scale(30),
        gap: scale(15),
    },
    Description: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    }
})
export default Prescription