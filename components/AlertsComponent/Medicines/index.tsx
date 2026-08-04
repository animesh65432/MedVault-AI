import { GetAllMedicines } from "@/db/alerts"
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { View } from "react-native"

export type Medicine = {
    Id: number;
    name: string
}


const Medicines: React.FC = () => {
    const db = useSQLiteContext();
    const [medicines, setMedicines] = useState<Medicine[]>([])

    async function fetchMedicines() {
        try {
            const data = await GetAllMedicines(db);
            setMedicines(data);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    }

    useEffect(() => {
        fetchMedicines();
    }, [])

    return (
        <View></View>
    )
}

export default Medicines