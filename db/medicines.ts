import { SQLiteDatabase } from "expo-sqlite";
import { AlertMedicineDetails, MedicineReminder, MedicineWithDetailsTypes } from "../types";

const parseTimings = (timings: string | null): string[] => {
    return timings ? timings.split(",").filter(Boolean) : [];
};

const insertTimings = async (
    db: SQLiteDatabase,
    medicineId: number,
    timing?: string[] | null
): Promise<void> => {
    if (!timing?.length) return;

    for (const t of timing) {
        await db.runAsync(
            "INSERT INTO MedicineTiming (MedicineId, timing) VALUES (?, ?)",
            [medicineId, t]
        );
    }
};

export const GetPrescriptionMedicines = async (
    db: SQLiteDatabase,
    page: number = 1,
    limit: number = 10
): Promise<MedicineWithDetailsTypes[]> => {
    try {
        const offset = (page - 1) * limit;

        const rows = await db.getAllAsync<MedicineWithDetailsTypes & { timings: string | null }>(`
            SELECT
                m.Id,
                m.DocumentId,
                m.name,
                m.dosage,
                m.frequency,
                m.duration,
                d.date AS prescribedDate,
                d.doctor_name AS doctorName,
                d.clinic_name AS clinicName,
                d.Id AS DocumentId,
                GROUP_CONCAT(mt.timing) AS timings
            FROM Medicines m
            JOIN Documents d ON d.Id = m.DocumentId
            LEFT JOIN MedicineTiming mt ON mt.MedicineId = m.Id
            GROUP BY m.Id
            ORDER BY d.date DESC, m.Id ASC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        return rows.map(({ timings, ...row }) => ({
            ...row,
            timing: parseTimings(timings),
        }));
    } catch (error) {
        console.error("Error fetching medicines:", error);
        return [];
    }
};

export const GetAllMedicines = async (
    db: SQLiteDatabase,
    page: number = 1,
    limit: number = 10
): Promise<MedicineWithDetailsTypes[]> => {
    try {
        const offset = (page - 1) * limit;

        const rows = await db.getAllAsync<MedicineWithDetailsTypes & { timings: string | null }>(`
            SELECT
                m.Id,
                m.DocumentId,
                m.name,
                m.dosage,
                m.frequency,
                m.duration,
                d.date AS prescribedDate,
                d.doctor_name AS doctorName,
                d.clinic_name AS clinicName,
                d.Id AS DocumentId,
                GROUP_CONCAT(mt.timing) AS timings
            FROM Medicines m
            LEFT JOIN Documents d ON d.Id = m.DocumentId
            LEFT JOIN MedicineTiming mt ON mt.MedicineId = m.Id
            GROUP BY m.Id
            ORDER BY d.date DESC, m.Id ASC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        return rows.map(({ timings, ...row }) => ({
            ...row,
            timing: parseTimings(timings),
        }));
    } catch (error) {
        console.error("Error fetching all medicines:", error);
        return [];
    }
};

export const deleteMedicine = async (db: SQLiteDatabase, medicineId: number): Promise<void> => {
    try {
        await db.runAsync("DELETE FROM Medicines WHERE Id = ?", [medicineId]);
    } catch (error) {
        console.error("Error deleting medicine:", error);
    }
};

export const updateMedicine = async (
    db: SQLiteDatabase,
    medicine: MedicineWithDetailsTypes
): Promise<void> => {
    try {
        await db.runAsync(
            "UPDATE Medicines SET name = ?, dosage = ?, frequency = ?, duration = ? WHERE Id = ?",
            [medicine.name, medicine.dosage, medicine.frequency, medicine.duration, medicine.Id]
        );
        await db.runAsync("DELETE FROM MedicineTiming WHERE MedicineId = ?", [medicine.Id]);
        await insertTimings(db, medicine.Id, medicine.timing);
    } catch (error) {
        console.error("Error updating medicine:", error);
    }
};

export const CreateMedicine = async (
    db: SQLiteDatabase,
    medicine: {
        name: string;
        dosage?: string | null;
        frequency?: string | null;
        duration?: string | null;
        DocumentId?: number;
        timing?: string[];
    }
): Promise<number | null> => {
    try {
        let result;
        if (medicine.DocumentId) {
            result = await db.runAsync(
                "INSERT INTO Medicines (DocumentId, name, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)",
                [
                    medicine.DocumentId,
                    medicine.name,
                    medicine.dosage ?? null,
                    medicine.frequency ?? null,
                    medicine.duration ?? null,
                ]
            );
        } else {
            result = await db.runAsync(
                "INSERT INTO Medicines (name, dosage, frequency, duration) VALUES (?, ?, ?, ?)",
                [
                    medicine.name,
                    medicine.dosage ?? null,
                    medicine.frequency ?? null,
                    medicine.duration ?? null,
                ]
            );
        }

        const medicineId = result.lastInsertRowId;

        await insertTimings(db, medicineId, medicine.timing);
        return medicineId;
    } catch (error) {
        console.error("Error creating medicine:", error);
        return null;
    }
};

export const GetPrescriptionMedicinesCount = async (db: SQLiteDatabase): Promise<number> => {
    try {
        const row = await db.getFirstAsync<{ count: number }>(
            `
            SELECT COUNT(DISTINCT d.Id) AS count
            FROM Documents d
            JOIN Medicines m ON m.DocumentId = d.Id
            WHERE d.type = 'Prescription'
            `
        );
        return row?.count ?? 0;
    } catch (error) {
        console.error("Error counting prescription medicines:", error);
        return 0;
    }
};

export const GetMedicinesCount = async (db: SQLiteDatabase): Promise<number> => {
    try {
        const row = await db.getFirstAsync<{ count: number }>(
            `
            SELECT COUNT(*) AS count
            FROM Medicines
            `
        );
        return row?.count ?? 0;
    } catch (error) {
        console.error("Error counting medicines:", error);
        return 0;
    }
};


export const GeAlertMedicineDetailsById = async (
    db: SQLiteDatabase,
    reminderId: number
): Promise<AlertMedicineDetails | null> => {
    try {
        const reminder = await db.getFirstAsync<MedicineReminder>(
            `SELECT  Id,  MedicineId, title, time, IsEnabled, repeat FROM Reminders WHERE Id = ?`,
            [reminderId]
        );

        if (!reminder) return null;

        const medicineId = reminder.MedicineId;

        const medicine = await db.getFirstAsync<{
            Id: number;
            name: string;
            dosage: string | null;
            frequency: string | null;
            duration: string | null;
            DocumentId: number | null;
        }>(
            `SELECT Id, name, dosage, frequency, duration, DocumentId
            FROM Medicines
            WHERE Id = ?`,
            [medicineId]
        );

        if (!medicine) return null;

        let doctor_name: string | null = null;
        let date: string | null = null;
        let notes: string[] = [];
        let isPdf: boolean = false;
        let source: string = "";

        if (medicine.DocumentId) {
            const [document, noteRows] = await Promise.all([
                db.getFirstAsync<{ doctor_name: string | null; date: string | null, IsPdf: boolean, SourceFilePath: string }>(
                    `SELECT doctor_name, date, IsPdf, SourceFilePath FROM Documents WHERE Id = ?`,
                    [medicine.DocumentId]
                ),
                db.getAllAsync<{ note: string }>(
                    `SELECT note FROM DocumentNotes WHERE DocumentId = ? ORDER BY SortOrder ASC`,
                    [medicine.DocumentId]
                ),
            ]);

            doctor_name = document?.doctor_name ?? null;
            date = document?.date ?? null;
            notes = noteRows.map((r) => r.note);
            isPdf = !!document?.IsPdf;
            source = document?.SourceFilePath ?? "";
        }

        return {
            ...medicine,
            doctor_name,
            date,
            notes,
            reminder,
            isPdf,
            source,
        };
    } catch (error) {
        console.error('Error fetching medicine details:', error);
        return null;
    }
};