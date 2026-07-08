import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 2;

    try {

        const result = await db.getFirstAsync<{ user_version: number }>(
            'PRAGMA user_version'
        );

        let currentDbVersion = result?.user_version ?? 0;

        console.log(`Current database version: ${currentDbVersion}`,
            "Database version", DATABASE_VERSION);

        if (currentDbVersion === 0) {
            currentDbVersion = 1;
        }


        if (currentDbVersion === DATABASE_VERSION) {
            console.log('Migrating database from version 1 to version 2...');
            await db.execAsync(`
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS Documents (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                type TEXT NOT NULL,

                -- common
                patient_name TEXT,
                date DATETIME,

                -- Prescription / Referral Letter
                doctor_name TEXT,
                clinic_name TEXT,

                -- Prescription Receipt
                pharmacy_name TEXT,
                total_amount TEXT,

                -- Lab Report
                lab_name TEXT,
                referred_by TEXT,

                -- Radiology Report
                center_name TEXT,
                modality TEXT,
                body_part TEXT,
                findings TEXT,
                impression TEXT,

                -- Medical Bill
                hospital_name TEXT,
                subtotal TEXT,
                discount TEXT,

                -- Discharge Summary
                admission_date DATETIME,
                discharge_date DATETIME,
                diagnosis TEXT,
                follow_up TEXT,

                -- Referral Letter
                referred_to TEXT,
                reason_for_referral TEXT,

                -- Generic (Insurance Document / Consent Form / Medical History Record / Other)
                summary TEXT,

                CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_documents_type ON Documents(type);
            CREATE INDEX IF NOT EXISTS idx_documents_date ON Documents(date);

            CREATE TABLE IF NOT EXISTS DocumentTags (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                tag TEXT NOT NULL,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_document_tags_tag ON DocumentTags(tag);
            CREATE INDEX IF NOT EXISTS idx_document_tags_document_id ON DocumentTags(DocumentId);

            CREATE TABLE IF NOT EXISTS DocumentNotes (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                note TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_document_notes_document_id ON DocumentNotes(DocumentId);

            CREATE TABLE IF NOT EXISTS DocumentKeyPoints (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                key_point TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_document_keypoints_document_id ON DocumentKeyPoints(DocumentId);

            CREATE TABLE IF NOT EXISTS DocumentProcedures (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                procedure TEXT NOT NULL,
                SortOrder INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_document_procedures_document_id ON DocumentProcedures(DocumentId);

            CREATE TABLE IF NOT EXISTS Medicines (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                name TEXT NOT NULL,
                dosage TEXT,
                frequency TEXT,
                duration TEXT,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_medicines_document_id ON Medicines(DocumentId);
            CREATE INDEX IF NOT EXISTS idx_medicines_name ON Medicines(name);

            CREATE TABLE IF NOT EXISTS MedicineTiming (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                MedicineId INTEGER NOT NULL,
                timing TEXT NOT NULL,
                FOREIGN KEY (MedicineId) REFERENCES Medicines(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_medicine_timing_medicine_id ON MedicineTiming(MedicineId);

            CREATE TABLE IF NOT EXISTS Reminders (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                MedicineId INTEGER NOT NULL,
                title TEXT NOT NULL,
                time DATETIME NOT NULL,
                repeat TEXT NOT NULL,
                FOREIGN KEY (MedicineId) REFERENCES Medicines(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_reminders_medicine_id ON Reminders(MedicineId);
            CREATE INDEX IF NOT EXISTS idx_reminders_time ON Reminders(time);

            CREATE TABLE IF NOT EXISTS LabTests (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                name TEXT NOT NULL,
                value TEXT,
                unit TEXT,
                normal_range TEXT,
                status TEXT,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_labtests_document_id ON LabTests(DocumentId);
            CREATE INDEX IF NOT EXISTS idx_labtests_name ON LabTests(name);
            CREATE INDEX IF NOT EXISTS idx_labtests_status ON LabTests(status);

            CREATE TABLE IF NOT EXISTS BillingItems (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                DocumentId INTEGER NOT NULL,
                name TEXT NOT NULL,
                price TEXT,
                FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_billingitems_document_id ON BillingItems(DocumentId);
        `);
            currentDbVersion = 2;
        }

        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

        console.log(`Database migrated to version ${DATABASE_VERSION}`);
    }
    catch (error) {
        console.error('Error during database migration:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}