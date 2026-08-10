import { MedicineReminder } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

const SNOOZE_MINUTES = 10;

const onTakeNow = async (db: SQLiteDatabase, reminder: MedicineReminder) => {
    try {
        const { Id: ReminderId, MedicineId, time: ScheduledTime } = reminder;

        const existing = await db.getFirstAsync<{ Id: number }>(
            `SELECT Id FROM DoseLogs
            WHERE ReminderId = ? AND ScheduledTime = ? AND Status = 'pending'`,
            [ReminderId, ScheduledTime]
        );

        if (existing) {
            await db.runAsync(
                `UPDATE DoseLogs
                SET Status = 'taken', ActionAt = CURRENT_TIMESTAMP, SnoozeUntil = NULL
                WHERE Id = ?`,
                [existing.Id]
            );
        } else {
            await db.runAsync(
                `INSERT INTO DoseLogs (ReminderId, MedicineId, ScheduledTime, Status, ActionAt)
                VALUES (?, ?, ?, 'taken', CURRENT_TIMESTAMP)`,
                [ReminderId, MedicineId, ScheduledTime]
            );
        }

        return true;
    } catch (error) {
        console.error("Error marking dose as taken:", error);
        return false;
    }
};


const onSnooze = async (db: SQLiteDatabase, reminder: MedicineReminder) => {
    try {
        const { Id: ReminderId, MedicineId, time: ScheduledTime } = reminder;

        const existing = await db.getFirstAsync<{ Id: number }>(
            `SELECT Id FROM DoseLogs
            WHERE ReminderId = ? AND ScheduledTime = ? AND Status IN ('pending', 'snoozed')`,
            [ReminderId, ScheduledTime]
        );

        if (existing) {
            await db.runAsync(
                `UPDATE DoseLogs
                SET Status = 'snoozed',
                    ActionAt = CURRENT_TIMESTAMP,
                    SnoozeUntil = datetime('now', '+${SNOOZE_MINUTES} minutes')
                WHERE Id = ?`,
                [existing.Id]
            );
        } else {
            await db.runAsync(
                `INSERT INTO DoseLogs (ReminderId, MedicineId, ScheduledTime, Status, ActionAt, SnoozeUntil)
                VALUES (?, ?, ?, 'snoozed', CURRENT_TIMESTAMP, datetime('now', '+${SNOOZE_MINUTES} minutes'))`,
                [ReminderId, MedicineId, ScheduledTime]
            );
        }

        return true;
    } catch (error) {
        console.error("Error snoozing reminder:", error);
        return false;
    }
};

export { onSnooze, onTakeNow };
