import { DocumentRow, RecordSummaryWithDocuments, RecordTypes } from "@/types";
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

    await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
            `INSERT INTO Records (Name) VALUES (?)`,
            [name]
        );
        recordId = result.lastInsertRowId;

        await AssignDocumentsToRecord(db, documentIds, recordId);
    });

    return recordId;
};

export const GetSummaryRecords = async (
    db: SQLiteDatabase,
    limit: number = 20,
    offset: number = 0
): Promise<RecordSummaryWithDocuments[]> => {
    console.log(`Fetching records with limit: ${limit}, offset: ${offset}`);
    const records = await db.getAllAsync<
        RecordTypes
    >(
        `SELECT *
        FROM Records
        ORDER BY CreatedAt DESC
        LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    if (records.length === 0) {
        return [];
    }

    const documentIds = [
        ...new Set(
            records.flatMap(record => {
                const ids = record.PreviewDocIds;

                if (Array.isArray(ids)) {
                    return ids;
                }

                if (typeof ids === "string") {
                    try {
                        const parsed = JSON.parse(ids);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return [];
                    }
                }

                return [];
            })
        )
    ];


    let documents: DocumentRow[] = [];

    if (documentIds.length > 0) {
        const placeholders = documentIds.map(() => "?").join(",");

        documents = await db.getAllAsync<DocumentRow>(
            `SELECT *
            FROM Documents
            WHERE Id IN (${placeholders})`,
            documentIds
        );
    }

    const documentsMap = new Map(
        documents.map(document => [document.Id, document])
    );

    return records.map(record => {
        const ids = Array.isArray(record.PreviewDocIds)
            ? record.PreviewDocIds
            : typeof record.PreviewDocIds === "string"
                ? (() => {
                    try {
                        const parsed = JSON.parse(record.PreviewDocIds);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return [];
                    }
                })()
                : [];

        return {
            Id: record.Id,
            Name: record.Name,
            UpdatedAt: record.UpdatedAt,
            CreatedAt: record.CreatedAt,
            documents: ids
                .map((id: number) => documentsMap.get(id))
                .filter(
                    (document): document is DocumentRow =>
                        document !== undefined
                )
        };
    });
};

export const GetRecordsCount = async (db: SQLiteDatabase): Promise<number> => {
    const result = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM Records`
    );
    return result?.count ?? 0;
};

export const GetRecordById = async (
    db: SQLiteDatabase,
    recordId: number,
    limit: number,
    offset: number
) => {
    const record = await db.getFirstAsync<RecordTypes>(
        `SELECT Id, Name, CreatedAt
        FROM Records
        WHERE Id = ?`,
        [recordId]
    );
    return {
        record
    };
};

export const DeleteRecordById = async (db: SQLiteDatabase, recordId: number) => {
    await db.withTransactionAsync(async () => {
        await db.runAsync(`DELETE FROM RecordDocuments WHERE RecordId = ?`, [recordId]);
        await db.runAsync(`DELETE FROM Records WHERE Id = ?`, [recordId]);
    });
};

export const UpdateRecord = async (
    db: SQLiteDatabase,
    recordId: number,
    name: string,
    documentIds: number[]
): Promise<void> => {
    await db.withTransactionAsync(async () => {
        await db.runAsync(
            `UPDATE Records SET Name = ? WHERE Id = ?`,
            [name, recordId]
        );

        await db.runAsync(
            `DELETE FROM RecordDocuments WHERE RecordId = ?`,
            [recordId]
        );

        await AssignDocumentsToRecord(db, documentIds, recordId);
    });
};

export const GetRecordDocumentIds = async (db: SQLiteDatabase, recordId: string): Promise<number[]> => {
    const rows = await db.getAllAsync<{ DocumentId: number }>(
        'SELECT DocumentId FROM RecordDocuments WHERE RecordId = ?',
        [recordId]
    );
    return rows.map(r => r.DocumentId);
}