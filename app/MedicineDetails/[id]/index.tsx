import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const MedicineDetails: React.FC = () => {
    const { id } = useLocalSearchParams();

    console.log("MedicineDetails ID:", id);
    return (
        <></>
    )
}

export default MedicineDetails