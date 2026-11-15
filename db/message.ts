import { ChatMessage, SourcesTypes, TypeOfDocumenet } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";


export const insertChatMessage = async (
    db: SQLiteDatabase,
    userMessage: string,
    aiResponse: string,
    recordId: number,
    showMore: boolean = false,
    tableName: string | null = null,
    types: TypeOfDocumenet[] | null = [],
    sources: SourcesTypes[] | null = [],
): Promise<number> => {

    const result = await db.runAsync(
        `INSERT INTO ChatMessages (ChatRecordId , UserMessage, AIResponse, ShowMore, TableName, Types, Soucres)
         VALUES (?,?, ?, ?, ?, ?, ?)`,
        [
            recordId,
            userMessage,
            aiResponse,
            showMore ? 1 : 0,
            tableName,
            types ? JSON.stringify(types) : null,
            sources ? JSON.stringify(sources) : null,
        ]
    );
    return result.lastInsertRowId;
};

export const loadChatMessages = async (db: SQLiteDatabase, chatRecordId: number): Promise<ChatMessage[]> => {
    const rows = await db.getAllAsync<{
        Id: number;
        UserMessage: string;
        AIResponse: string;
        ShowMore: number;
        TableName: string | null;
        Types: string | null;
        Soucres: string | null;
        CreatedAt: string;
    }>(`SELECT *
     FROM ChatMessages
     WHERE chatRecordId = ?
     ORDER BY CreatedAt ASC`, [chatRecordId]
    );

    return rows.map((r) => ({
        Id: r.Id,
        UserMessage: r.UserMessage,
        AIResponse: r.AIResponse,
        ShowMore: !!r.ShowMore,
        TableName: r.TableName,
        Types: r.Types ? (JSON.parse(r.Types) as TypeOfDocumenet[]) : [],
        Soucres: r.Soucres ? (JSON.parse(r.Soucres) as SourcesTypes[]) : [],
        CreatedAt: r.CreatedAt,
    }));
};

