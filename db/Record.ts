import { RecordTypes } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

const AssignDocumentsToRecord = async (
    db: SQLiteDatabase,
    documentIds: number[],
    recordId: number
): Promise<void> => {
    for (const documentId of documentIds) {
        await db.runAsync(
            `INSERT INTO RecordDocuments (RecordId, DocumentId)
             VALUES (?, ?)`,
            [recordId, documentId]
        );
    }
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
    let recordId = 0;

    await db.withExclusiveTransactionAsync(async (txn) => {

        const result = await txn.runAsync(
            `INSERT INTO Records (Name) VALUES (?)`,
            [name]
        );

        recordId = result.lastInsertRowId;

        await AssignDocumentsToRecord(
            txn,
            documentIds,
            recordId
        );
    });

    return recordId;
};

export const GetSummaryRecords = async (
    db: SQLiteDatabase,
    order: "ASC" | "DESC" = "DESC",
    limit: number = 20,
    offset: number = 0
) => {

    const records = await db.getAllAsync<RecordTypes>(
        `SELECT * FROM Records ORDER BY UpdatedAt ${order} LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    console.log("records", records);

    return [];
};

export const GetRecordsCount = async (db: SQLiteDatabase): Promise<number> => {
    const result = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM Records`
    );
    return result?.count ?? 0;
};
