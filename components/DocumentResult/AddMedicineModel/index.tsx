import React from "react";
import { Modal } from "react-native";

type Props = {
    isMedicineModalVisible: boolean;
    setMedicineModalIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMedicineModal: React.FC<Props> = ({ isMedicineModalVisible, setMedicineModalIsVisible }) => {
    return <Modal
        visible={isMedicineModalVisible}
        animationType="fade"
        transparent
    >
    </Modal>
}

export default AddMedicineModal;