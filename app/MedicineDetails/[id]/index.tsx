import DocumentSkeleton from "@/components/DocumentSkeleton";
import MedicineDetailsComponent from "@/components/MedicineDetailsComponent";
import { GetMedicineDetailsById } from "@/db/medicines";
import { MedicineDetails as MedicineDetailsTypes } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";

const MedicineDetails: React.FC = () => {
    const db = useSQLiteContext();
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [medicineDetails, setMedicineDetails] = useState<MedicineDetailsTypes | null>(null);
    const { id } = useLocalSearchParams();

    const fetchMedicineDetails = async () => {
        if (typeof id !== 'string') {
            console.error("Invalid medicine ID:", id);
            return;
        }
        let reminderId = Number(id);
        setIsLoading(true);
        try {
            const medicineDetails = await GetMedicineDetailsById(db, reminderId);
            setMedicineDetails(medicineDetails);
        } catch (error) {
            console.log("Failed to fetch medicine details:", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMedicineDetails();
    }, [id])

    if (IsLoading || !medicineDetails) {
        return (
            <DocumentSkeleton />
        )
    }

    return (
        <MedicineDetailsComponent
            medicineDetails={medicineDetails}
        />
    )
}

export default MedicineDetails