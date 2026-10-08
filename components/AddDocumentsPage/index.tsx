import { GetDocuments } from "@/db/document"
import { DocumentRow, TypeOfDocumenet } from "@/types"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useSQLiteContext } from "expo-sqlite"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Documents from "./Documents"
import Filter from "./Filter"
import Navabr from './Navbar'

export type selectedType = TypeOfDocumenet | "All Types"

const PAGE_SIZE = 20;

const AddDocumentsPage: React.FC = () => {
    const db = useSQLiteContext();
    const [selected, setSelected] = useState<selectedType>("All Types");
    const [documents, setdocuments] = useState<DocumentRow[]>([]);
    const [CurrentDate, SetCurrentDate] = useState<string>("");
    const [SelectedDocuments, setSelectedDocuments] = useState<DocumentRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const isLoadingMoreRef = useRef(false);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            let defaultSelected: selectedType[] = [];
            if (selected !== "All Types") {
                defaultSelected = [selected]
            }
            const rows = await GetDocuments(db, "DESC", PAGE_SIZE, 0, defaultSelected, {
                startDate: null,
                endDate: null,
            });
            setdocuments(rows);
            pageRef.current = 1;
            hasMoreRef.current = rows.length === PAGE_SIZE;
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoading(false);
        }
    }, [db, selected]);

    useEffect(() => {
        fetchDocuments();
    }, [selected])

    const loadMore = useCallback(async () => {
        if (!hasMoreRef.current || isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;

        const nextPage = pageRef.current + 1;
        try {
            const rows = await GetDocuments(
                db,
                "DESC",
                PAGE_SIZE,
                (nextPage - 1) * PAGE_SIZE,
                [],
                { startDate: null, endDate: null }
            );
            setdocuments((prev) => [...prev, ...rows]);
            hasMoreRef.current = rows.length === PAGE_SIZE;
            pageRef.current = nextPage;
        } catch (error) {
            console.error("Failed to load more documents:", error);
        } finally {
            isLoadingMoreRef.current = false;
        }
    }, [db]);

    return (
        <View style={styles.container}>
            <Navabr
                SelectedDocuments={SelectedDocuments}
            />
            <Filter
                selected={selected}
                setSelected={setSelected}
            />
            <Documents
                documents={documents}
                onScroll={loadMore}
                navbarHeight={0}
                SetCurrentDate={SetCurrentDate}
                isLoadingMore={isLoadingMoreRef.current}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                SelectedDocuments={SelectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: vScale(40),
        paddingHorizontal: scale(20),
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: vScale(20)
    }
})

export default AddDocumentsPage