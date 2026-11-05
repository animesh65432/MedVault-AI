import { SQLiteDatabase } from "expo-sqlite";

export const GetALLChatCounts = async (db: SQLiteDatabase) => {
    try {
        const count = await db.getAllAsync(`SELECT COUNT(*) as count FROM ChatRecords`);
        console.log("Total chat records count:", count[0]);
        return 1;
    } catch (error) {
        return 0;
    }
}