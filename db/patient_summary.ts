import { SQLiteDatabase } from "expo-sqlite";

export interface ActiveMedicine {
    name: string;
    dosage: string | null;
    frequency: string | null;
    duration_days: number | null;
    start_date: string;
    mention_count: number;
}

export interface HighRiskDocument {
    Id: number;
    title: string;
    type: string;
    date: string;
    doctor_name: string | null;
    hospital_name: string | null;
    diagnosis: string | null;
    findings: string | null;
    impression: string | null;
}

export interface PatientSummary {
    activeMedicines: ActiveMedicine[];
    highRiskDocuments: HighRiskDocument[];
    generatedAt: string;
}

export const GetPatientSummary = async (db: SQLiteDatabase): Promise<PatientSummary> => {
    try {
        const activeMedicines = await db.getAllAsync<ActiveMedicine>(`
            SELECT
                m.name,
                m.dosage,
                m.frequency,
                MAX(m.duration_days) AS duration_days,
                MAX(d.date) AS start_date,
                COUNT(*) AS mention_count
            FROM Medicines m
            JOIN Documents d ON m.DocumentId = d.Id
            WHERE
                (m.duration_days IS NULL AND julianday('now') - julianday(d.date) <= 90)
                OR (m.duration_days IS NOT NULL
                    AND date(d.date, '+' || m.duration_days || ' days') >= date('now'))
            GROUP BY LOWER(m.name)
            ORDER BY MAX(d.date) DESC;
        `);

        const highRiskDocuments = await db.getAllAsync<HighRiskDocument>(`
            SELECT Id, title, type, date, doctor_name, hospital_name, diagnosis, findings, impression
            FROM Documents
            WHERE risk_level = 'High'
              AND date >= date('now', '-3 months')
            ORDER BY date DESC;
        `);

        return {
            activeMedicines,
            highRiskDocuments,
            generatedAt: new Date().toISOString(),
        };
    }
    catch (error) {
        console.error("Error fetching patient summary:", error);
        throw error;
    }
}