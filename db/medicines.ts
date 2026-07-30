import { SQLiteDatabase } from "expo-sqlite";
import { MedicineWithDetailsTypes } from "../types";

export const GetMedicines = async (
    db: SQLiteDatabase
): Promise<MedicineWithDetailsTypes[]> => {
    try {
        const medicines = await db.getAllAsync<MedicineWithDetailsTypes>(`
            SELECT
                m.Id,
                m.DocumentId,
                m.name,
                m.dosage,
                m.frequency,
                m.duration,
                d.date AS prescribedDate,
                d.doctor_name AS doctorName,
                d.clinic_name AS clinicName
            FROM Medicines m
            JOIN Documents d ON d.Id = m.DocumentId
            ORDER BY d.date DESC, m.Id ASC
        `);

        for (const med of medicines) {
            const timings = await db.getAllAsync<{ timing: string }>(
                "SELECT timing FROM MedicineTiming WHERE MedicineId = ?",
                [med.Id]
            );
            med.timings = timings.map(t => t.timing);
        }

        return medicines;
    } catch (error) {
        console.error("Error fetching medicines:", error);
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

export const updateMedicine = async (db: SQLiteDatabase, medicine: MedicineWithDetailsTypes): Promise<void> => {
    try {
        await db.runAsync(
            "UPDATE Medicines SET name = ?, dosage = ?, frequency = ?, duration = ? WHERE Id = ?",
            [medicine.name, medicine.dosage, medicine.frequency, medicine.duration, medicine.Id]
        );
    } catch (error) {
        console.error("Error updating medicine:", error);
    }
};



export const CreateMedicine = async (
    db: SQLiteDatabase,
    medicine: {
        DocumentId: number;
        name: string;
        dosage?: string | null;
        frequency?: string | null;
        duration?: string | null;
        timings?: string[];
    }
): Promise<number | null> => {
    try {
        const result = await db.runAsync(
            "INSERT INTO Medicines (DocumentId, name, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)",
            [
                medicine.DocumentId,
                medicine.name,
                medicine.dosage ?? null,
                medicine.frequency ?? null,
                medicine.duration ?? null,
            ]
        );

        const medicineId = result.lastInsertRowId;

        if (medicine.timings?.length) {
            for (const timing of medicine.timings) {
                await db.runAsync(
                    "INSERT INTO MedicineTiming (MedicineId, timing) VALUES (?, ?)",
                    [medicineId, timing]
                );
            }
        }

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
}