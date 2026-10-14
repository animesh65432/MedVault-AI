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

    console.log("documentIds in CreateRecord:", documentIds);

    const result = await db.runAsync(
        `INSERT INTO Records (Name) VALUES (?)`,
        [name]
    );

    await AssignDocumentsToRecord(db, documentIds, result.lastInsertRowId);
    return result.lastInsertRowId;
};

export const GetAllDocumentsForRecord = async (
    db: SQLiteDatabase,
    recordId: number
): Promise<number[]> => {
    const rows = await db.getAllAsync<{ Id: number }>(
        `SELECT * FROM Documents WHERE RecordId = ?`,
        [recordId]
    );
    return rows.map(row => row.Id);
};

export const GetRecords = async (
    db: SQLiteDatabase,
    order: "ASC" | "DESC" = "DESC",
    limit: number = 20,
    offset: number = 0
): Promise<[]> => {

    const rows = await db.getAllAsync(
        `SELECT * FROM Documents WHERE RecordId IS NOT NULL`,
    );

    console.log("Fetched Records:", rows);

    return [];
};