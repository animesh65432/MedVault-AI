import { SourceConfig } from "@/types";

export const SOURCES: SourceConfig[] = [
    { ftsTable: "DocumentsSearch", baseTable: "Documents", label: "in Document", snippetCol: -1, directDocId: true },
    { ftsTable: "MedicinesSearch", baseTable: "Medicines", label: "in Medicines", snippetCol: -1, directDocId: false },
    { ftsTable: "LabTestsSearch", baseTable: "LabTests", label: "in Lab tests", snippetCol: -1, directDocId: false },
    { ftsTable: "BillingItemsSearch", baseTable: "BillingItems", label: "in Billing", snippetCol: -1, directDocId: false },
    { ftsTable: "DocumentNotesSearch", baseTable: "DocumentNotes", label: "in Notes", snippetCol: -1, directDocId: false },
    { ftsTable: "DocumentTagsSearch", baseTable: "DocumentTags", label: "in Tags", snippetCol: -1, directDocId: false },
    { ftsTable: "DocumentKeyPointsSearch", baseTable: "DocumentKeyPoints", label: "in Key points", snippetCol: -1, directDocId: false },
    { ftsTable: "DocumentProceduresSearch", baseTable: "DocumentProcedures", label: "in Procedures", snippetCol: -1, directDocId: false },
]