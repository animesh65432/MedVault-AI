import { ReminderWithMedicine } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

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

export const GetAllReminders = async (
    db: SQLiteDatabase
): Promise<ReminderWithMedicine[]> => {
    try {
        const result = await db.getAllAsync<ReminderWithMedicine>(`
            SELECT
                r.Id,
                r.MedicineId,
                r.title,
                r.time,
                r.repeat,
                m.name AS medicineName,
                m.dosage,
                m.frequency
            FROM Reminders r
            JOIN Medicines m ON r.MedicineId = m.Id
            ORDER BY r.time ASC
        `)
        return result
    } catch (error) {
        console.error('Error fetching reminders:', error)
        return []
    }
}

export const deleteReminder = async (db: SQLiteDatabase, reminderId: number): Promise<void> => {
    try {
        await db.runAsync(
            `DELETE FROM Reminders WHERE Id = ?`,
            [reminderId]
        );
    } catch (error) {
        console.error(`Error deleting reminder with ID ${reminderId}:`, error);
    }
};


export const updateReminder = async (
    db: SQLiteDatabase,
    reminderId: number,
    reminder: ReminderWithMedicine
): Promise<boolean> => {
    const { MedicineId, title, time, repeat } = reminder

    const fields: Record<string, unknown> = { MedicineId, title, time, repeat }
    const entries = Object.entries(fields).filter(([, value]) => value !== undefined)

    if (entries.length === 0) {
        console.warn(`updateReminder called with no fields for ID ${reminderId}`)
        return false
    }

    const setClause = entries.map(([key]) => `${key} = ?`).join(', ')
    const values = entries.map(([, value]) => value as number | string | null)

    try {
        await db.runAsync(
            `UPDATE Reminders SET ${setClause} WHERE Id = ?`,
            [...values, reminderId]
        )
        return true
    } catch (error) {
        console.error(`Error updating reminder with ID ${reminderId}:`, error)
        return false
    }
}