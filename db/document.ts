import { BillingItem, DocumentRow, DocumentType, LabTest, Medicine, Reminder, SearchSuggestion, UploadedDocument } from "@/types";
import { SOURCES } from "@/utils/contensnt";
import { toLocalDateString } from "@/utils/toLocalDateString";
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

export const create_document = async (
    db: SQLiteDatabase,
    doc: DocumentType,
    SourceFilePath: string,
    Hash: string,
    IsPdf: boolean
): Promise<number> => {
    let documentId: number | undefined;

    await db.withTransactionAsync(async () => {
        const meta: any = doc.document_metadata;

        switch (doc.type) {
            case "Prescription": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, doctor_name, clinic_name, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.doctor_name, meta.clinic_name, meta.date, SourceFilePath, Hash, IsPdf]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Prescription Receipt": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, pharmacy_name, total_amount, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.pharmacy_name, meta.total_amount, meta.date, SourceFilePath, Hash, IsPdf]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertBillingItems(db, documentId, meta.billing_items ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Lab Report": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, lab_name, referred_by, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.lab_name, meta.referred_by, meta.date, SourceFilePath, Hash, IsPdf]
                );
                documentId = r.lastInsertRowId;
                await insertLabTests(db, documentId, meta.tests ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Radiology Report": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, referred_by, center_name, date, modality, body_part, findings, impression, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.referred_by, meta.center_name, meta.date,
                    meta.modality, meta.body_part, meta.findings, meta.impression, SourceFilePath, Hash, IsPdf]
                );
                documentId = r.lastInsertRowId;
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Medical Bill": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, hospital_name, subtotal, discount, total_amount, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.hospital_name, meta.subtotal, meta.discount, meta.total_amount, meta.date, SourceFilePath, Hash, IsPdf]
                );
                documentId = r.lastInsertRowId;
                await insertBillingItems(db, documentId, meta.billing_items ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Discharge Summary": {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, hospital_name, admission_date, discharge_date, diagnosis, follow_up, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.hospital_name, meta.admission_date, meta.discharge_date, meta.diagnosis, meta.follow_up, meta.date, SourceFilePath, Hash, IsPdf]
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
                    `INSERT INTO Documents (title, type, patient_name, doctor_name, referred_to, reason_for_referral, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.doctor_name, meta.referred_to, meta.reason_for_referral, meta.date, SourceFilePath, Hash, IsPdf]
                );
                documentId = r.lastInsertRowId;
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            default: {
                const r = await db.runAsync(
                    `INSERT INTO Documents (title, type, patient_name, summary, date, SourceFilePath, Hash, IsPdf)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [doc.title, doc.type, meta.patient_name, meta.summary, meta.date, SourceFilePath, Hash, IsPdf]
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

    if (documentId === undefined) {
        throw new Error(`create_document: no row inserted for type "${doc.type}"`);
    }

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
    CATEGORIES?: string[],
    DATE_RANGE?: { startDate: Date | null; endDate: Date | null }
): Promise<DocumentRow[]> => {
    try {
        const hasCategories = !!CATEGORIES && CATEGORIES.length > 0
        const hasDateRange = !!(DATE_RANGE?.startDate && DATE_RANGE?.endDate)

        const conditions: string[] = []
        const params: (string | number)[] = []


        if (hasCategories) {
            const placeholders = CATEGORIES!.map(() => '?').join(', ')
            conditions.push(`Documents.type IN (${placeholders})`)
            params.push(...CATEGORIES!)
        }

        if (hasDateRange) {
            conditions.push(`COALESCE(Documents.date, Documents.CreatedAt) BETWEEN ? AND ?`)
            params.push(
                toLocalDateString(DATE_RANGE!.startDate!),
                toLocalDateString(DATE_RANGE!.endDate!)
            )
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const rows = await db.getAllAsync<DocumentRow>(
            `SELECT *
            FROM Documents
            ${whereClause}
            ORDER BY COALESCE(date, CreatedAt) ${ORDER}
            LIMIT ?`,
            [...params, LIMIT]
        )
        return rows
    } catch (error) {
        console.error("Error getting documents:", error)
        return []
    }
}

export const GetSearchByKeyword = async (
    db: SQLiteDatabase,
    searchQuery: string,
    ORDER: "DESC" | "ASC",
    LIMIT: number
): Promise<DocumentRow[]> => {
    try {
        const rows = await db.getAllAsync<DocumentRow>(
            `SELECT Documents.*
            FROM DocumentsSearch
            JOIN Documents ON Documents.Id = DocumentsSearch.rowid
            WHERE DocumentsSearch MATCH ?
            ORDER BY COALESCE(Documents.date, Documents.CreatedAt) ${ORDER}
            LIMIT ?`,
            [searchQuery.trim() + '*', LIMIT]
        )
        return rows
    } catch (error) {
        console.error("Error searching documents:", error)
        return []
    }
}

export const HasAnyDocuments = async (db: SQLiteDatabase): Promise<boolean> => {
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM Documents`
        );
        return (result?.count ?? 0) > 0;
    } catch (error) {
        console.error("Error checking if any documents exist:", error);
        return false;
    }
}

export const GetSearchSuggestions = async (
    db: SQLiteDatabase,
    query: string,
    perSourceLimit = 3,
    totalLimit = 6
): Promise<SearchSuggestion[]> => {
    const q = query.trim()
    if (!q) return []
    const matchTerm = `"${q.replace(/"/g, '""')}"*`
    try {
        const queries = SOURCES.map(async (src) => {
            if (src.directDocId) {
                return db.getAllAsync<any>(
                    `SELECT
                        Documents.Id as documentId,
                        Documents.title as title,
                        Documents.type as type,
                        COALESCE(Documents.date, Documents.CreatedAt) as date,
                        snippet(${src.ftsTable}, ${src.snippetCol}, '⟪', '⟫', '…', 10) as snip
                    FROM ${src.ftsTable}
                    JOIN Documents ON Documents.Id = ${src.ftsTable}.rowid
                    WHERE ${src.ftsTable} MATCH ?
                    LIMIT ?`,
                    [matchTerm, perSourceLimit]
                )
            }
            return db.getAllAsync<any>(
                `SELECT
                    Documents.Id as documentId,
                    Documents.title as title,
                    Documents.type as type,
                    COALESCE(Documents.date, Documents.CreatedAt) as date,
                    snippet(${src.ftsTable}, ${src.snippetCol}, '⟪', '⟫', '…', 10) as snip
                FROM ${src.ftsTable}
                JOIN ${src.baseTable} ON ${src.baseTable}.Id = ${src.ftsTable}.rowid
                JOIN Documents ON Documents.Id = ${src.baseTable}.DocumentId
                WHERE ${src.ftsTable} MATCH ?
                LIMIT ?`,
                [matchTerm, perSourceLimit]
            )
        })

        const resultsPerSource = await Promise.all(queries)

        const merged: SearchSuggestion[] = []

        resultsPerSource.forEach((rows, i) => {
            rows.forEach((row: any) => {
                merged.push({
                    documentId: row.documentId,
                    title: row.title,
                    date: row.date,
                    field: SOURCES[i].label,
                    snippet: row.snip,
                    type: row.type || null,
                })
            })
        })

        const seen = new Set<number>()
        const deduped = merged.filter(s => {
            if (seen.has(s.documentId)) return false
            seen.add(s.documentId)
            return true
        })

        return deduped.slice(0, totalLimit)
    } catch (error) {
        console.error("Error getting search suggestions:", error)
        return []
    }
}

export const GetDocumentById = async (db: SQLiteDatabase, documentId: number): Promise<DocumentRow | null> => {
    try {
        const row = await db.getFirstAsync<DocumentRow>(
            `SELECT *
             FROM Documents
             WHERE Id = ?`,
            [documentId]
        )

        if (!row) return null

        row.tags = await db.getAllAsync<{ tag: string }>(
            `SELECT tag FROM DocumentTags WHERE DocumentId = ?`,
            [documentId]
        ).then(rows => rows.map(r => r.tag))

        row.notes = await db.getAllAsync<{ note: string }>(
            `SELECT note FROM DocumentNotes WHERE DocumentId = ? ORDER BY SortOrder`,
            [documentId]
        ).then(rows => rows.map(r => r.note))

        switch (row.type) {
            case "Prescription": {
                row.medicines = await getMedicinesForDocument(db, documentId)
                break
            }
            case "Prescription Receipt": {
                row.medicines = await getMedicinesForDocument(db, documentId)
                row.billing_items = await db.getAllAsync<BillingItem>(
                    `SELECT * FROM BillingItems WHERE DocumentId = ?`,
                    [documentId]
                )
                break
            }
            case "Lab Report": {
                row.tests = await db.getAllAsync<LabTest>(
                    `SELECT * FROM LabTests WHERE DocumentId = ?`,
                    [documentId]
                )
                break
            }
            case "Radiology Report": {
                break
            }
            case "Medical Bill": {
                row.billing_items = await db.getAllAsync<BillingItem>(
                    `SELECT * FROM BillingItems WHERE DocumentId = ?`,
                    [documentId]
                )
                break
            }
            case "Discharge Summary": {
                row.procedures = await db.getAllAsync<{ procedure: string }>(
                    `SELECT procedure FROM DocumentProcedures WHERE DocumentId = ?`,
                    [documentId]
                ).then(rows => rows.map(r => r.procedure))
                row.medicines = await getMedicinesForDocument(db, documentId)
                row.tests = await db.getAllAsync<LabTest>(
                    `SELECT * FROM LabTests WHERE DocumentId = ?`,
                    [documentId]
                )
                break
            }
            case "Referral Letter": {
                row.medicines = await getMedicinesForDocument(db, documentId)
                break
            }
            default: {
                row.medicines = await getMedicinesForDocument(db, documentId)
                row.key_points = await db.getAllAsync<{ key_point: string }>(
                    `SELECT key_point FROM DocumentKeyPoints WHERE DocumentId = ? ORDER BY SortOrder`,
                    [documentId]
                ).then(rows => rows.map(r => r.key_point))
                break
            }
        }

        return row
    } catch (error) {
        console.error("Error getting document by ID:", error)
        return null
    }
}

async function getMedicinesForDocument(db: SQLiteDatabase, documentId: number): Promise<Medicine[]> {
    const medicines = await db.getAllAsync<any>(
        `SELECT * FROM Medicines WHERE DocumentId = ?`,
        [documentId]
    )

    for (const med of medicines) {
        const timingRows = await db.getAllAsync<{ timing: string }>(
            `SELECT timing FROM MedicineTiming WHERE MedicineId = ?`,
            [med.Id]
        )
        med.timing = timingRows.map(t => t.timing)

        const reminderRows = await db.getAllAsync<any>(
            `SELECT * FROM Reminders WHERE MedicineId = ?`,
            [med.Id]
        )
        med.reminders = reminderRows.map(r => ({
            ...r,
            time: new Date(r.time),
        }))
    }

    return medicines
}

export const AddReminderToMedicineReturningId = async (
    db: SQLiteDatabase,
    medicineId: number,
    reminder: Reminder
): Promise<number> => {
    const result = await db.runAsync(
        `INSERT INTO Reminders (MedicineId, title, time, repeat) VALUES (?, ?, ?, ?)`,
        [medicineId, reminder.title, reminder.time.toISOString(), reminder.repeat]
    );
    return result.lastInsertRowId;
};

export const RemoveReminderFromMedicine = async (db: SQLiteDatabase, reminderId: number): Promise<void> => {
    await db.runAsync(`DELETE FROM Reminders WHERE Id = ?`, [reminderId]);
};


async function deleteMedicinesForDocument(db: SQLiteDatabase, documentId: number) {
    const medicineRows = await db.getAllAsync<{ Id: number }>(
        `SELECT Id FROM Medicines WHERE DocumentId = ?`,
        [documentId]
    );
    for (const { Id } of medicineRows) {
        await db.runAsync(`DELETE FROM Reminders WHERE MedicineId = ?`, [Id]);
        await db.runAsync(`DELETE FROM MedicineTiming WHERE MedicineId = ?`, [Id]);
    }
    await db.runAsync(`DELETE FROM Medicines WHERE DocumentId = ?`, [documentId]);
}

async function deleteChildRows(db: SQLiteDatabase, documentId: number) {
    await deleteMedicinesForDocument(db, documentId);
    await db.runAsync(`DELETE FROM LabTests WHERE DocumentId = ?`, [documentId]);
    await db.runAsync(`DELETE FROM BillingItems WHERE DocumentId = ?`, [documentId]);
    await db.runAsync(`DELETE FROM DocumentProcedures WHERE DocumentId = ?`, [documentId]);
    await db.runAsync(`DELETE FROM DocumentKeyPoints WHERE DocumentId = ?`, [documentId]);
    await db.runAsync(`DELETE FROM DocumentTags WHERE DocumentId = ?`, [documentId]);
    await db.runAsync(`DELETE FROM DocumentNotes WHERE DocumentId = ?`, [documentId]);
}

export const update_document = async (
    db: SQLiteDatabase,
    doc: UploadedDocument
): Promise<void> => {
    await db.withTransactionAsync(async () => {
        const meta: any = doc;

        const documentId = doc.Id;

        await deleteChildRows(db, documentId);

        switch (doc.type) {
            case "Prescription": {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, doctor_name = ?, clinic_name = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.doctor_name, meta.clinic_name, meta.date, documentId]
                );
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Prescription Receipt": {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, pharmacy_name = ?, total_amount = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.pharmacy_name, meta.total_amount, meta.date, documentId]
                );
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertBillingItems(db, documentId, meta.billing_items ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Lab Report": {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, lab_name = ?, referred_by = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.lab_name, meta.referred_by, meta.date, documentId]
                );
                await insertLabTests(db, documentId, meta.tests ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Radiology Report": {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, referred_by = ?, center_name = ?, date = ?,
                     modality = ?, body_part = ?, findings = ?, impression = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.referred_by, meta.center_name, meta.date,
                    meta.modality, meta.body_part, meta.findings, meta.impression, documentId]
                );
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Medical Bill": {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, hospital_name = ?, subtotal = ?, discount = ?,
                     total_amount = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.hospital_name, meta.subtotal, meta.discount, meta.total_amount, meta.date, documentId]
                );
                await insertBillingItems(db, documentId, meta.billing_items ?? []);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            case "Discharge Summary": {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, hospital_name = ?, admission_date = ?,
                     discharge_date = ?, diagnosis = ?, follow_up = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.hospital_name, meta.admission_date, meta.discharge_date, meta.diagnosis, meta.follow_up, meta.date, documentId]
                );
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
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, doctor_name = ?, referred_to = ?,
                     reason_for_referral = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.doctor_name, meta.referred_to, meta.reason_for_referral, meta.date, documentId]
                );
                for (const med of meta.medicines ?? []) await insertMedicine(db, documentId, med);
                await insertTagsAndNotes(db, documentId, meta.tags, meta.important_notes);
                break;
            }

            default: {
                await db.runAsync(
                    `UPDATE Documents SET title = ?, type = ?, patient_name = ?, summary = ?, date = ?
                     WHERE Id = ?`,
                    [doc.title, doc.type, meta.patient_name, meta.summary, meta.date, documentId]
                );
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
};

export const delete_document = async (db: SQLiteDatabase, documentId: number): Promise<void> => {
    await db.withTransactionAsync(async () => {
        await deleteChildRows(db, documentId);
        await db.runAsync(`DELETE FROM Documents WHERE Id = ?`, [documentId]);
    });
};

