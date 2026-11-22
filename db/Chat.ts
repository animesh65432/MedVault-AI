import { RecentCoversation } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

export const GetRecentDocument = async (db: SQLiteDatabase): Promise<RecentCoversation[] | null> => {
    try {
        const RecentDocuments = await db.getAllAsync(
            `SELECT * FROM ChatRecords 
            ORDER BY CreatedAt DESC
            LIMIT 1`
        ) as RecentCoversation[];
        return RecentDocuments;
    } catch (error) {
        return null;
    }
}

export const createChatRecord = async (db: SQLiteDatabase, ChatName: string): Promise<number | null> => {
    try {
        const ChatRecord = await db.runAsync(`
        INSERT INTO ChatRecords 
        (Name) VALUES (?)`, [ChatName]);
        return ChatRecord.lastInsertRowId;
    } catch (error) {
        return null;
    }
}

export const GetAllChatTitles = async (
    db: SQLiteDatabase,
    page: number,
    limit: number,
    query: string
): Promise<RecentCoversation[] | null> => {
    try {
        const escaped = query.trim().replace(/[\\%_]/g, '\\$&');
        return await db.getAllAsync<RecentCoversation>(
            `SELECT * FROM ChatRecords
             WHERE Name LIKE ? ESCAPE '\\'
             ORDER BY CreatedAt DESC
             LIMIT ? OFFSET ?`,
            [`%${escaped}%`, limit, (page - 1) * limit]
        );
    } catch (error) {
        console.log('GetAllChatTitles error:', error);
        return null;
    }
};