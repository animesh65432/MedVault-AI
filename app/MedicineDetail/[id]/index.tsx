import DocumentSkeleton from "@/components/DocumentSkeleton";
import MedicineDetailComponent from "@/components/MedicineDetail";
import { GetMedicineDetailId, MedicineDetail as MedicineDetailTypes } from "@/db/medicines";
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from 'react';

const MedicineDetail: React.FC = () => {
    const db = useSQLiteContext();
    const [medicineDetail, setMedicineDetail] = useState<MedicineDetailTypes | null>(null)
    const [IsLoading, SetIsLoading] = useState<boolean>(false)
    const { id } = useLocalSearchParams();

    const fetchMedicineDetails = async () => {
        SetIsLoading(true);
        if (typeof id !== 'string') {
            console.error("Invalid medicine ID:", id);
            return;
        }
        let reminderId = Number(id);
        try {
            const medicineDetail = await GetMedicineDetailId(db, reminderId);
            setMedicineDetail(medicineDetail);
        } catch (error) {
            console.log("Failed to fetch medicine details:", error);
        }
        finally {
            SetIsLoading(false);
        }

    }

    useEffect(() => {
        fetchMedicineDetails()
    }, [id])

    if (IsLoading || !medicineDetail) {
        return (
            <DocumentSkeleton />
        )
    }

    return <MedicineDetailComponent
        medicineDetail={medicineDetail}
    />
}

export default MedicineDetail