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

export const GetAllChatTitles = async (db: SQLiteDatabase): Promise<RecentCoversation[] | null> => {
    try {
        const messages = await db.getAllAsync(
            `SELECT * FROM ChatRecords`
        ) as RecentCoversation[];
        return messages;
    } catch (error) {
        return null;
    }
}