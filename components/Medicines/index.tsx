import RowSkeleton from "@/components/Skeleton/Row"
import { GetAllMedicines, GetDocumentHasMedicinesCount, GetMedicinesCount, GetPrescriptionMedicines } from "@/db/medicines"
import { MedicinesTab, MedicineWithDetailsTypes } from "@/types"
import { vScale } from "@/utils/vScale"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native"
import AddMedicine from "./AddMedicine"
import AddMedicineModal from "./AddMedicineModal"
import Divider from "./Divider"
import Empty from "./Empty"
import FAB from "./Fab"
import MedicineCard from "./MedicineCard"
import Navbar from "./Navbar"
import SectionHeader from "./SectionHeader"
import TabSwitcher from "./TabSwitcher"

type ListRow =
    | { type: "divider"; key: string; label: string, DocumentId: number, date: Date }
    | { type: "medicine"; key: string; medicine: MedicineWithDetailsTypes }

const Limit = 10

const dedupeById = (list: MedicineWithDetailsTypes[]): MedicineWithDetailsTypes[] => {
    const seen = new Set<number>()
    return list.filter((m) => {
        if (seen.has(m.Id)) return false
        seen.add(m.Id)
        return true
    })
}

const MedicinesComponent: React.FC = () => {
    const db = useSQLiteContext()
    const [DocumentId, setDocumentId] = useState<number | null>(null)
    const [IsLoadIng, setIsLoading] = useState<boolean>(false)
    const [Page, setPage] = useState<number>(1)
    const [count, setCount] = useState<number>(0)
    const [IsLoadIngMore, setIsLoadingMore] = useState<boolean>(false)
    const [HasMore, setHasMore] = useState<boolean>(true)
    const [IsAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState<boolean>(false)
    const [medicines, setMedicines] = useState<MedicineWithDetailsTypes[]>([])
    const [activeTab, setActiveTab] = useState<MedicinesTab>("Documents")
    const skipNextFocusReload = useRef(false)

    const fetchMedicineList = useCallback(
        async (tab: MedicinesTab, pageNum: number) => {
            return tab === "Documents"
                ? await GetPrescriptionMedicines(db, pageNum, Limit)
                : await GetAllMedicines(db, pageNum, Limit)
        },
        [db]
    )

    const fetchCount = useCallback(
        async (tab: MedicinesTab) => {
            return tab === "Documents"
                ? await GetDocumentHasMedicinesCount(db)
                : await GetMedicinesCount(db)
        },
        [db]
    )

    const loadInitial = useCallback(
        async (tab: MedicinesTab) => {
            setIsLoading(true)
            try {
                const [count, result] = await Promise.all([fetchCount(tab), fetchMedicineList(tab, 1)])
                setMedicines((prev) => {
                    const resultIds = new Set(result.map((m) => m.Id))
                    const keepFromPrev = prev.filter((m) => !resultIds.has(m.Id))
                    return dedupeById([...result, ...keepFromPrev])
                })
                setPage(1)
                setCount(count)
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
            setMedicines((prev) => dedupeById([...prev, ...result]))
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
            if (skipNextFocusReload.current) {
                skipNextFocusReload.current = false
                return
            }
            loadInitial(activeTab)
        }, [activeTab, loadInitial])
    )

    const rows: ListRow[] = useMemo(() => {
        if (activeTab === "all") {
            return medicines.map((m) => ({
                type: "medicine" as const,
                key: `med-${m.name}-${m.Id}`,
                medicine: m,
            }))
        }

        const groups = new Map<string, MedicineWithDetailsTypes[]>()

        for (const med of medicines) {
            const key = med.DocumentId != null ? `doc-${med.DocumentId}` : `unknown-${med.Id}`
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(med)
        }

        const out: ListRow[] = []
        for (const [key, meds] of groups) {
            if (meds[0].DocumentId) {
                out.push({
                    type: "divider",
                    key: `div-${key}`,
                    label: `${meds[0].doctorName ?? meds[0].clinicName ?? meds[0].documentTitle}`,
                    DocumentId: meds[0].DocumentId,
                    date: new Date(meds[0].prescribedDate),
                })
            }
            for (const med of meds) {
                out.push({ type: "medicine", key: `med-${med.Id}`, medicine: med })
            }
        }
        return out
    }, [medicines, activeTab])

    async function refreshCount() {
        try {
            const count = await fetchCount(activeTab)
            setCount(count)
        } catch (error) {
            console.log("Error refreshing count:", error)
        }
    }

    const deleteMedicineFromState = (medicineId: number) => {
        setMedicines((prev) => prev.filter((m) => m.Id !== medicineId))
        refreshCount()
    }

    const updateMedicineFromState = (updatedMedicine: MedicineWithDetailsTypes) => {
        setMedicines((prev) =>
            prev.map((m) => (m.Id === updatedMedicine.Id ? updatedMedicine : m))
        )
    }

    const addMedicineFromeState = (newMedicine: MedicineWithDetailsTypes) => {
        skipNextFocusReload.current = true
        setMedicines((prev) => dedupeById([newMedicine, ...prev]))
        refreshCount();
    }

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
                {!IsLoadIng &&
                    <SectionHeader
                        title={activeTab === "Documents" ? "Documents" : "All Medicines"}
                        count={count}
                    />
                }
                {IsLoadIng ?
                    <RowSkeleton
                        count={4}
                    /> :
                    <FlatList
                        data={rows}
                        ListEmptyComponent={!IsLoadIng ? <Empty /> : null}
                        keyExtractor={(row) => row.key}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.4}
                        initialNumToRender={12}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        removeClippedSubviews
                        ListFooterComponent={
                            IsLoadIngMore ? (
                                <ActivityIndicator style={styles.footerSpinner} color="#234338" />
                            ) : null
                        }
                        renderItem={({ item }) =>
                            item.type === "divider" ? (
                                <>
                                    <Divider
                                        date={item.date}
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
                                    deleteMedicineFromState={deleteMedicineFromState}
                                    updateMedicineFromState={updateMedicineFromState}
                                    medicine={item.medicine}
                                />
                            )
                        }
                    />
                }
            </View>
            {activeTab !== "Documents" && (
                <FAB onPress={OnToggoleAddMedicine} />
            )}
            {
                IsAddMedicineModalOpen && (
                    <AddMedicineModal
                        addMedicineFromeState={addMedicineFromeState}
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