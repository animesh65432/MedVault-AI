import { scale } from "@/utils/scale";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
    IsAddMedicineModalOpen: boolean,
    setIsAddMedicineModalOpe: React.Dispatch<React.SetStateAction<boolean>>;
    DocumentId: number;
    setDocumentId: React.Dispatch<React.SetStateAction<number | null>>;
}

const AddMedicine: React.FC<Props> = ({ DocumentId, IsAddMedicineModalOpen, setIsAddMedicineModalOpe, setDocumentId }) => {

    const handleAddMedicine = () => {
        setDocumentId(DocumentId);
        setIsAddMedicineModalOpe(!IsAddMedicineModalOpen);
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleAddMedicine}
        >
            <MaterialIcons
                name="add"
                size={scale(16)}
                color="white"
            />
            <Text style={styles.text}>Add Medicine</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1F3A2E",
        padding: scale(4),
        borderRadius: scale(14),
        width: scale(120),
        marginLeft: "auto",
        marginTop: scale(8),
        marginBottom: scale(8),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(4),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: scale(14),
    }
})

export default AddMedicine