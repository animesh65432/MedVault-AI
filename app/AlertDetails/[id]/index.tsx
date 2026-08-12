import AlertDetailsComponent from "@/components/AlertDetailsComponent";
import DocumentSkeleton from "@/components/DocumentSkeleton";
import { GeAlertMedicineDetailsById } from "@/db/medicines";
import { AlertMedicineDetails as AlertMedicineDetailsTypes } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";

const AlertDetails: React.FC = () => {
    const db = useSQLiteContext();
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [medicineDetails, setMedicineDetails] = useState<AlertMedicineDetailsTypes | null>(null);
    const { id } = useLocalSearchParams();

    const fetchMedicineDetails = async () => {
        if (typeof id !== 'string') {
            console.error("Invalid medicine ID:", id);
            return;
        }
        let reminderId = Number(id);
        setIsLoading(true);
        try {
            const medicineDetails = await GeAlertMedicineDetailsById(db, reminderId);
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
        <AlertDetailsComponent
            medicineDetails={medicineDetails}
        />
    )
}

export default AlertDetails;