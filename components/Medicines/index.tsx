import { CreateMedicine, GetAllMedicines, GetMedicinesCount, GetPrescriptionMedicines, GetPrescriptionMedicinesCount } from "@/db/medicines"
import { MedicinesTab, MedicineWithDetailsTypes } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import React, { useCallback, useMemo, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native"
import AddMedicine from "./AddMedicine"
import AddMedicineModal from "./AddMedicineModal"
import DateDivider from "./DateDivider"
import FAB from "./Fab"
import MedicineCard from "./MedicineCard"
import Navbar from "./Navbar"
import SectionHeader from "./SectionHeader"
import TabSwitcher from "./TabSwitcher"

type ListRow =
    | { type: "divider"; key: string; label: string, DocumentId: number }
    | { type: "medicine"; key: string; medicine: MedicineWithDetailsTypes }

const Limit = 10

const MedicinesComponent: React.FC = () => {
    const db = useSQLiteContext()
    const [DocumentId, setDocumentId] = useState<number | null>(null)
    const [IsLoadIng, setIsLoading] = useState<boolean>(true)
    const [Page, setPage] = useState<number>(1)
    const [IsLoadIngMore, setIsLoadingMore] = useState<boolean>(false)
    const [HasMore, setHasMore] = useState<boolean>(true)
    const [IsAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState<boolean>(false)
    const [Count, setCount] = useState(0)
    const [medicines, setMedicines] = useState<MedicineWithDetailsTypes[]>([])
    const [activeTab, setActiveTab] = useState<MedicinesTab>("prescription")

    const fetchMedicineList = useCallback(
        async (tab: MedicinesTab, pageNum: number) => {
            return tab === "prescription"
                ? await GetPrescriptionMedicines(db, pageNum, Limit)
                : await GetAllMedicines(db, pageNum, Limit)
        },
        [db]
    )

    const fetchCount = useCallback(
        async (tab: MedicinesTab) => {
            return tab === "prescription"
                ? await GetPrescriptionMedicinesCount(db)
                : await GetMedicinesCount(db)
        },
        [db]
    )

    const loadInitial = useCallback(
        async (tab: MedicinesTab) => {
            setIsLoading(true)
            try {
                const [count, result] = await Promise.all([
                    fetchCount(tab),
                    fetchMedicineList(tab, 1),
                ])
                setCount(count)
                setMedicines(result)
                setPage(1)
                setHasMore(result.length === Limit)
            } catch (error) {
                console.log("Error fetching medicines:", error)
                setMedicines([])
                setHasMore(false)
            } finally {
                setIsLoading(false)
            }
        },
        [fetchCount, fetchMedicineList]
    )

    const loadMore = useCallback(async () => {
        if (IsLoadIngMore || IsLoadIng || !HasMore) return
        setIsLoadingMore(true)
        try {
            const nextPage = Page + 1
            const result = await fetchMedicineList(activeTab, nextPage)
            setMedicines((prev) => [...prev, ...result])
            setPage(nextPage)
            setHasMore(result.length === Limit)
        } catch (error) {
            console.log("Error loading more medicines:", error)
        } finally {
            setIsLoadingMore(false)
        }
    }, [IsLoadIngMore, IsLoadIng, HasMore, Page, activeTab, fetchMedicineList])

    useFocusEffect(
        useCallback(() => {
            loadInitial(activeTab)
        }, [activeTab, loadInitial])
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
            if (meds[0].DocumentId !== undefined) {
                out.push({ type: "divider", key: `div-${date}`, label: `PRESCRIBED ${date}`, DocumentId: meds[0].DocumentId })
            }
            for (const med of meds) {
                out.push({ type: "medicine", key: `med-${med.Id}`, medicine: med })
            }
        }
        return out
    }, [medicines, activeTab])

    const OnToggoleAddMedicine = () => {
        setIsAddMedicineModalOpen((prev) => !prev)
    }

    const onAddMedicine = async (medicine: MedicineWithDetailsTypes) => {
        try {
            await CreateMedicine(db, {
                ...medicine,
                DocumentId: DocumentId || undefined,
            })
            await loadInitial(activeTab)
            setDocumentId(null)
        } catch (error) {
            console.log("Error adding medicine:", error)
        }
        finally {
            setIsAddMedicineModalOpen(false)
        }
    }

    return (
        <View style={styles.container}>
            <Navbar />
            <View style={styles.DownContainer}>
                <TabSwitcher
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
                {!IsLoadIng &&
                    <SectionHeader
                        title={activeTab === "prescription" ? "Prescriptions" : "All Medicines"}
                        count={Count}
                    />
                }
                {IsLoadIng ?
                    <ActivityIndicator
                        style={styles.MainSpinner}
                        color="#234338"
                        size={scale(30)}
                    /> :
                    <FlatList
                        data={rows}
                        keyExtractor={(row) => row.key}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={
                            IsLoadIngMore ? (
                                <ActivityIndicator style={styles.footerSpinner} color="#234338" />
                            ) : null
                        }
                        renderItem={({ item }) =>
                            item.type === "divider" ? (
                                <>
                                    <DateDivider
                                        label={item.label}
                                    />
                                    <AddMedicine
                                        DocumentId={item.DocumentId}
                                        setDocumentId={setDocumentId}
                                        IsAddMedicineModalOpen={IsAddMedicineModalOpen}
                                        setIsAddMedicineModalOpe={setIsAddMedicineModalOpen}
                                    />
                                </>
                            ) : (
                                <MedicineCard
                                    activeTab={activeTab}
                                    loadInitial={loadInitial}
                                    medicine={item.medicine}
                                />
                            )
                        }
                    />
                }
            </View>
            {activeTab !== "prescription" && (
                <FAB onPress={OnToggoleAddMedicine} />
            )}
            {
                IsAddMedicineModalOpen && (
                    <AddMedicineModal
                        activeTab={activeTab}
                        loadInitial={loadInitial}
                        DocumentId={DocumentId}
                        isMedicineModalVisible={IsAddMedicineModalOpen}
                        setMedicineModalIsVisible={setIsAddMedicineModalOpen}
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
    },
    footerSpinner: {
        marginVertical: vScale(16),
    },
    MainSpinner: {
        marginVertical: vScale(166)
    }
})

export default MedicinesComponent