import { BillingItem, DocumentRow, DocumentType, LabTest, Medicine } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";


async function insertMedicine(db: SQLiteDatabase, documentId: number, med: Medicine) {
    const result = await db.runAsync(
        `INSERT INTO Medicines (DocumentId, name, dosage, frequency, duration)
         VALUES (?, ?, ?, ?, ?)`,
        [documentId, med.name, med.dosage ?? null, med.frequency ?? null, med.duration ?? null]
    );
    const medicineId = result.lastInsertRowId;

    for (const t of med.timing ?? []) {
        await db.runAsync(
            `INSERT INTO MedicineTiming (MedicineId, timing) VALUES (?, ?)`,
            [medicineId, t]
        );
    }

    for (const r of med.reminders ?? []) {
        await db.runAsync(
            `INSERT INTO Reminders (MedicineId, title, time, repeat) VALUES (?, ?, ?, ?)`,
            [medicineId, r.title, r.time.toISOString(), r.repeat]
        );
    }
}

async function insertLabTests(db: SQLiteDatabase, documentId: number, tests: LabTest[]) {
    for (const t of tests) {
        await db.runAsync(
            `INSERT INTO LabTests (DocumentId, name, value, unit, normal_range, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [documentId, t.name, t.value ?? null, t.unit ?? null, t.normal_range ?? null, t.status ?? null]
        );
    }
}

async function insertBillingItems(db: SQLiteDatabase, documentId: number, items: BillingItem[]) {
    for (const b of items) {
        await db.runAsync(
            `INSERT INTO BillingItems (DocumentId, name, price) VALUES (?, ?, ?)`,
            [documentId, b.name, b.price ?? null]
        );
    }
}

async function insertTagsAndNotes(db: SQLiteDatabase, documentId: number, tags: string[] = [], notes: string[] = []) {
    for (const tag of tags) {
        await db.runAsync(`INSERT INTO DocumentTags (DocumentId, tag) VALUES (?, ?)`, [documentId, tag]);
    }
    for (const [i, note] of notes.entries()) {
        await db.runAsync(`INSERT INTO DocumentNotes (DocumentId, note, SortOrder) VALUES (?, ?, ?)`, [documentId, note, i]);
    }
}

export const create_document = async (db: SQLiteDatabase, doc: DocumentType, SourceFilePath: string, Hash: string): Promise<number> => {
    let documentId!: number;

    await db.withTransactionAsync(async () => {
        const meta: any = doc.document_metadata;
        switch (doc.type) {
            case "Prescription": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, doctor_name, clinic_name, date, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.doctor_name, meta.clinic_name, meta.date, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Prescription Receipt": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, pharmacy_name, total_amount, date, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.pharmacy_name, meta.total_amount, meta.date, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertBillingItems(db, documentId, meta.billing_items ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Lab Report": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, lab_name, referred_by, date,SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.lab_name, meta.referred_by, meta.date, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                await insertLabTests(db, documentId, meta.tests ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Radiology Report": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, referred_by, center_name, date, modality, body_part, findings, impression, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.referred_by, meta.center_name, meta.date,
                    meta.modality, meta.body_part, meta.findings, meta.impression, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Medical Bill": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, hospital_name, subtotal, discount, total_amount, date, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
                    [doc.title, doc.type, meta.patient_name, meta.hospital_name, meta.subtotal, meta.discount, meta.total_amount, meta.date, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                await insertBillingItems(db, documentId, meta.billing_items ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Discharge Summary": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, hospital_name, admission_date, discharge_date, diagnosis, follow_up, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.hospital_name, meta.admission_date, meta.discharge_date, meta.diagnosis, meta.follow_up, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                for (const proc of meta.procedures ?? []) {
                    await db.runAsync(
                        `INSERT INTO DocumentProcedures (DocumentId, procedure) VALUES (?, ?)`,
                        [documentId, proc]
                    );
                }
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertLabTests(db, documentId, meta.tests ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Referral Letter": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, doctor_name, referred_to, reason_for_referral, date, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.referring_doctor, meta.referred_to, meta.reason_for_referral, meta.date, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            default: {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, summary, date, SourceFilePath, Hash)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.summary, meta.date, SourceFilePath, Hash]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                for (const [i, kp] of (meta.key_points ?? []).entries()) {
                    await db.runAsync(
                        `INSERT INTO DocumentKeyPoints (DocumentId, key_point, SortOrder) VALUES (?, ?, ?)`,
                        [documentId, kp, i]
                    );
                }
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }
        }
    });

    return documentId;
};

export const CheckDocumentExists = async (
    db: SQLiteDatabase,
    Hash: string,
): Promise<boolean> => {
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count
             FROM Documents
             WHERE Hash = ?`,
            [Hash]
        );
        return (result?.count ?? 0) > 0;
    } catch (error) {
        console.error("Error checking document:", error);
        return false;
    }
};

export const GetDocumentsCount = async (db: SQLiteDatabase): Promise<number> => {
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Documents`
        );
        return result?.count ?? 0;
    } catch (error) {
        console.error("Error getting documents count:", error);
        return 0;
    }
};

export const GetMedicinesCount = async (db: SQLiteDatabase): Promise<number> => {
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Medicines`
        );
        return result?.count ?? 0;
    } catch (error) {
        console.error("Error getting medicines count:", error);
        return 0;
    }
}

export const GetRemindersCount = async (db: SQLiteDatabase): Promise<number> => {
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Reminders`
        );
        return result?.count ?? 0;
    } catch (error) {
        console.error("Error getting reminders count:", error);
        return 0;
    }
}

export const GetDocuments = async (
    db: SQLiteDatabase,
    ORDER: "DESC" | "ASC",
    LIMIT: number,
    searchQuery?: string
): Promise<DocumentRow[]> => {
    try {
        if (searchQuery && searchQuery.trim().length > 0) {
            const rows = await db.getAllAsync<DocumentRow>(
                `SELECT Documents.*
                FROM DocumentsSearch
                JOIN Documents ON Documents.Id = DocumentsSearch.rowid
                WHERE DocumentsSearch MATCH ?
                ORDER BY COALESCE(Documents.date, Documents.CreatedAt) ${ORDER}
                LIMIT ?`,
                [searchQuery.trim() + '*', LIMIT]
            );
            return rows;
        }

        const rows = await db.getAllAsync<DocumentRow>(
            `SELECT *
            FROM Documents
            ORDER BY COALESCE(date, CreatedAt) ${ORDER}
            LIMIT ?`,
            [LIMIT]
        );

        return rows;
    } catch (error) {
        console.error("Error getting documents:", error);
        return [];
    }
}