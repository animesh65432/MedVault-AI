import { GetMedicines, GetMedicinesCount, GetPrescriptionMedicinesCount } from "@/db/medicines"
import { MedicinesTab, MedicineWithDetailsTypes } from "@/types"
import { vScale } from "@/utils/vScale"
import { useFocusEffect, useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import React, { useCallback, useMemo, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import AddMedicineModal from "../DocumentResult/AddMedicineModel"
import DateDivider from "./DateDivider"
import FAB from "./Fab"
import MedicineCard from "./MedicineCard"
import Navbar from "./Navbar"
import SectionHeader from "./SectionHeader"
import TabSwitcher from "./TabSwitcher"

type ListRow =
    | { type: "divider"; key: string; label: string }
    | { type: "medicine"; key: string; medicine: MedicineWithDetailsTypes }

const MedicinesComponent: React.FC = () => {
    const db = useSQLiteContext()
    const router = useRouter()
    const [IsAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState<boolean>(false)
    const [Count, setCount] = useState(0)
    const [medicines, setMedicines] = useState<MedicineWithDetailsTypes[]>([])
    const [activeTab, setActiveTab] = useState<MedicinesTab>("prescription")
    const [collapsed, setCollapsed] = useState(false)

    async function fetchMedicines() {
        try {
            if (activeTab === "prescription") {
                const count = await GetPrescriptionMedicinesCount(db)
                setCount(count)
            } else {
                const count = await GetMedicinesCount(db)
                setCount(count)
            }
            const result = await GetMedicines(db)
            setMedicines(result)
        } catch (error) {
            setMedicines([])
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchMedicines()
        }, [activeTab])
    )

    const rows: ListRow[] = useMemo(() => {
        if (activeTab === "all") {
            return medicines.map((m) => ({
                type: "medicine" as const,
                key: `med-${m.Id}`,
                medicine: m,
            }))
        }

        const groups = new Map<string, MedicineWithDetailsTypes[]>()

        for (const med of medicines) {
            const key = med.prescribedDate ?? "Unknown"
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(med)
        }

        const out: ListRow[] = []
        for (const [date, meds] of groups) {
            out.push({ type: "divider", key: `div-${date}`, label: `PRESCRIBED ${date}` })
            for (const med of meds) {
                out.push({ type: "medicine", key: `med-${med.Id}`, medicine: med })
            }
        }
        return out
    }, [medicines, activeTab]);

    const OnToggoleAddMedicine = () => {
        setIsAddMedicineModalOpen((prev) => !prev)
    }

    return (
        <View style={styles.container}>
            <Navbar />
            <View style={styles.DownContainer}>
                <TabSwitcher
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
                <SectionHeader
                    title={activeTab === "prescription" ? "Prescriptions" : "All Medicines"}
                    count={Count}
                />
                {!collapsed && (
                    <FlatList
                        data={rows}
                        keyExtractor={(row) => row.key}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) =>
                            item.type === "divider" ? (
                                <DateDivider label={item.label} />
                            ) : (
                                <MedicineCard
                                    medicine={item.medicine}
                                />
                            )
                        }
                    />
                )}
            </View>
            <FAB onPress={OnToggoleAddMedicine} />
            {
                IsAddMedicineModalOpen && (
                    <AddMedicineModal
                        onAddMedicine={(medicine) => {
                            setIsAddMedicineModalOpen(false);
                        }}
                        setMedicineModalIsVisible={setIsAddMedicineModalOpen}
                        isMedicineModalVisible={IsAddMedicineModalOpen}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: vScale(10),
        paddingBottom: vScale(32),
        gap: vScale(20),
        backgroundColor: "#F7F9F8",
    },
    listContent: {
        gap: vScale(12),
        paddingBottom: vScale(300),
    },
    DownContainer: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(12),
        paddingHorizontal: vScale(18),
    }
})

export default MedicinesComponent