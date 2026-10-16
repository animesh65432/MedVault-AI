import { DocumentRow, RecordRow } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

const AssignDocumentsToRecord = async (
    db: SQLiteDatabase,
    documentIds: number[],
    recordId: number
) => {
    if (documentIds.length === 0) return;
    const placeholders = documentIds.map(() => '?').join(',');
    await db.runAsync(
        `UPDATE Documents
     SET RecordId = ?, UpdatedAt = CURRENT_TIMESTAMP
     WHERE Id IN (${placeholders})`,
        [recordId, ...documentIds]
    );
};

export const CheckRecordExists = async (
    db: SQLiteDatabase,
    name: string
): Promise<boolean> => {
    const result = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM Records WHERE Name = ?`,
        [name]
    );
    return (result?.count ?? 0) > 0;
};

export const CreateRecord = async (
    db: SQLiteDatabase,
    name: string,
    documentIds: number[]
): Promise<number> => {

    const result = await db.runAsync(
        `INSERT INTO Records (Name) VALUES (?)`,
        [name]
    );

    await AssignDocumentsToRecord(db, documentIds, result.lastInsertRowId);
    return result.lastInsertRowId;
};

export const GetSummaryRecords = async (
    db: SQLiteDatabase,
    order: "ASC" | "DESC" = "DESC",
    limit: number = 20,
    offset: number = 0,
    docsPerRecord: number = 3
) => {

    const records = await db.getAllAsync<RecordRow>(
        `SELECT * FROM Records ORDER BY UpdatedAt ${order} LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    const result = await Promise.all(
        records.map(async (record) => ({
            ...record,
            documents: await db.getAllAsync<DocumentRow>(
                `SELECT Id, RecordId, title, type, date, IsPdf, risk_level
         FROM Documents
         WHERE RecordId = ?
         ORDER BY Id DESC
         LIMIT ?`,
                [record.Id, docsPerRecord]
            ),
        }))
    );

    return result;
};