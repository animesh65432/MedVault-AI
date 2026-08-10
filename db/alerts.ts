import { ReminderWithMedicine } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

type Medicine = {
    Id: number;
    name: string
    dosage: string;
    frequency: string
}

export type NewReminder = {
    MedicineId: number;
    title: string;
    time: Date;
    repeat: string;
};


export const GetRemindersCount = async (db: SQLiteDatabase): Promise<number> => {
    try {
        const result = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM Reminders`);
        return result?.count ?? 0;
    } catch (error) {
        console.error("Error getting reminders count:", error);
        return 0;
    }
}

export const GetAllReminders = async (
    db: SQLiteDatabase,
    offset: number = 1,
    limit: number = 15
): Promise<ReminderWithMedicine[]> => {
    try {
        const result = await db.getAllAsync<ReminderWithMedicine>(`
            SELECT
                r.Id,
                r.MedicineId,
                r.title,
                r.time,
                r.repeat,
                r.IsEnabled,
                m.name AS medicineName,
                m.dosage,
                m.frequency
            FROM Reminders r
            JOIN Medicines m ON r.MedicineId = m.Id
            ORDER BY r.time DESC
            LIMIT ? OFFSET ?
        `, [limit, (offset - 1) * limit]);
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


export const CrateReminder = async (
    db: SQLiteDatabase,
    reminder: NewReminder
): Promise<number | null> => {
    const { MedicineId, title, time, repeat } = reminder;
    try {
        const result = await db.runAsync(
            `INSERT INTO Reminders (MedicineId, title, time, repeat) VALUES (?, ?, ?, ?)`,
            [MedicineId, title, time.toISOString(), repeat]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating reminder:', error);
        return null;
    }
};

export const GetAllMedicines = async (db: SQLiteDatabase, page: number = 1,
    limit: number = 10): Promise<Medicine[]> => {
    try {
        const result = await db.getAllAsync<any>(
            `SELECT Id, name, dosage,frequency  FROM Medicines
            LIMIT ? OFFSET ?`,
            [limit, (page - 1) * limit]
        )
        return result
    } catch (error) {
        console.error('Error fetching medicines:', error)
        return []
    }
}

export const OffAlarm = async (db: SQLiteDatabase, reminderId: number): Promise<void> => {
    try {
        await db.runAsync(
            `UPDATE Reminders SET IsEnabled = 0 WHERE Id = ?`,
            [reminderId]
        );
    } catch (error) {
        console.error(`Error disabling alarm for reminder with ID ${reminderId}:`, error);
    }
}

const OnAlarm = async (db: SQLiteDatabase, reminderId: number): Promise<void> => {
    try {
        await db.runAsync(
            `UPDATE Reminders SET IsEnabled = 1 WHERE Id = ?`,
            [reminderId]
        );
    } catch (error) {
        console.error(`Error enabling alarm for reminder with ID ${reminderId}:`, error);
    }
}

export const toggleAlarm = async (db: SQLiteDatabase, reminderId: number, isEnabled: boolean): Promise<void> => {
    if (isEnabled) {
        await OnAlarm(db, reminderId);
    } else {
        await OffAlarm(db, reminderId);
    }
};

