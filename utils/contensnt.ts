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
export const FILTER_OPTIONS = [
    { name: "All Records", icon: "layers" },
    { name: "Prescription", icon: "file-plus" },
    { name: "Prescription Receipt", icon: "shopping-bag" },
    { name: "Lab Report", icon: "thermometer" },
    { name: "Radiology Report", icon: "crosshair" },
    { name: "Medical Bill", icon: "dollar-sign" },
    { name: "Discharge Summary", icon: "external-link" },
    { name: "Referral Letter", icon: "corner-up-right" },
    { name: "Insurance Document", icon: "umbrella" },
    { name: "Consent Form", icon: "check-square" },
    { name: "Medical History Record", icon: "clock" },
    { name: "Other", icon: "archive" },
] as const

export const TEMPLATE_QUESTIONS = [
    "What medicines am I currently on?",
    "Summarize my last report",
    "What are my upcoming reminders?",
    "Show my recent prescriptions"
]


export const DosageUnitOptions = [
    { label: "mg", value: "mg" },
    { label: "ml", value: "ml" },
    { label: "tablet", value: "tablet" },
    { label: "drops", value: "drops" },
    { label: "puff", value: "puff" },
]

export const DurationUnitOptions = [
    { label: "days", value: "days" },
    { label: "weeks", value: "weeks" },
    { label: "months", value: "months" },
]
