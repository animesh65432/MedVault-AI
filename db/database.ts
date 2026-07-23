import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 2;

    try {
        const result = await db.getFirstAsync<{ user_version: number }>(
            'PRAGMA user_version'
        );

        let currentDbVersion = result?.user_version ?? 0;

        if (currentDbVersion === 0) {
            currentDbVersion = 1;
        }

        if (currentDbVersion < DATABASE_VERSION) {

            await db.execAsync(`
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS Documents (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                type TEXT NOT NULL,
                IsPdf BOOLEAN NOT NULL DEFAULT 0,

                -- common
                patient_name TEXT,
                date DATETIME NOT NULL,

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
                UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                SourceFilePath TEXT NOT NULL,
                Hash TEXT NOT NULL UNIQUE
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

            CREATE TABLE IF NOT EXISTS MESSAGES (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                UserMessage TEXT NOT NULL,
                AIResponse TEXT NOT NULL,
                CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            -- ================= FTS5 SEARCH TABLES =================

            CREATE VIRTUAL TABLE IF NOT EXISTS DocumentsSearch USING fts5(
                title,
                type,
                date,
                patient_name,
                doctor_name,
                clinic_name,
                pharmacy_name,
                lab_name,
                hospital_name,
                summary,
                diagnosis,
                findings,
                impression,
                total_amount,
                content='Documents',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS DocumentTagsSearch USING fts5(
                tag,
                content='DocumentTags',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS DocumentNotesSearch USING fts5(
                note,
                content='DocumentNotes',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS DocumentKeyPointsSearch USING fts5(
                key_point,
                content='DocumentKeyPoints',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS DocumentProceduresSearch USING fts5(
                procedure,
                content='DocumentProcedures',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS MedicinesSearch USING fts5(
                name,
                dosage,
                frequency,
                duration,
                content='Medicines',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS LabTestsSearch USING fts5(
                name,
                value,
                unit,
                normal_range,
                status,
                content='LabTests',
                content_rowid='Id'
            );

            CREATE VIRTUAL TABLE IF NOT EXISTS BillingItemsSearch USING fts5(
                name,
                price,
                content='BillingItems',
                content_rowid='Id'
            );
            

            -- ================= SYNC TRIGGERS =================
            -- External-content FTS5 tables do NOT auto-populate.
            -- Every base table needs 3 triggers: insert, delete, update.
            -- Pattern for update: delete old row from index, then insert new row.

            -- Documents -> DocumentsSearch
            CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON Documents BEGIN
                INSERT INTO DocumentsSearch(rowid, title, type, patient_name, doctor_name, clinic_name, pharmacy_name, lab_name, hospital_name, summary, diagnosis, findings, impression, total_amount)
                VALUES (new.Id, new.title, new.type, new.patient_name, new.doctor_name, new.clinic_name, new.pharmacy_name, new.lab_name, new.hospital_name, new.summary, new.diagnosis, new.findings, new.impression, new.total_amount);
            END;

            CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON Documents BEGIN
                INSERT INTO DocumentsSearch(DocumentsSearch, rowid, title, type, patient_name, doctor_name, clinic_name, pharmacy_name, lab_name, hospital_name, summary, diagnosis, findings, impression, total_amount)
                VALUES('delete', old.Id, old.title, old.type, old.patient_name, old.doctor_name, old.clinic_name, old.pharmacy_name, old.lab_name, old.hospital_name, old.summary, old.diagnosis, old.findings, old.impression, old.total_amount);
            END;

            CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON Documents BEGIN
                INSERT INTO DocumentsSearch(DocumentsSearch, rowid, title, type, patient_name, doctor_name, clinic_name, pharmacy_name, lab_name, hospital_name, summary, diagnosis, findings, impression, total_amount)
                VALUES('delete', old.Id, old.title, old.type, old.patient_name, old.doctor_name, old.clinic_name, old.pharmacy_name, old.lab_name, old.hospital_name, old.summary, old.diagnosis, old.findings, old.impression, old.total_amount);
                INSERT INTO DocumentsSearch(rowid, title, type, patient_name, doctor_name, clinic_name, pharmacy_name, lab_name, hospital_name, summary, diagnosis, findings, impression, total_amount)
                VALUES (new.Id, new.title, new.type, new.patient_name, new.doctor_name, new.clinic_name, new.pharmacy_name, new.lab_name, new.hospital_name, new.summary, new.diagnosis, new.findings, new.impression, new.total_amount);
            END;

            -- DocumentTags -> DocumentTagsSearch
            CREATE TRIGGER IF NOT EXISTS document_tags_ai AFTER INSERT ON DocumentTags BEGIN
                INSERT INTO DocumentTagsSearch(rowid, tag) VALUES (new.Id, new.tag);
            END;

            CREATE TRIGGER IF NOT EXISTS document_tags_ad AFTER DELETE ON DocumentTags BEGIN
                INSERT INTO DocumentTagsSearch(DocumentTagsSearch, rowid, tag) VALUES('delete', old.Id, old.tag);
            END;

            CREATE TRIGGER IF NOT EXISTS document_tags_au AFTER UPDATE ON DocumentTags BEGIN
                INSERT INTO DocumentTagsSearch(DocumentTagsSearch, rowid, tag) VALUES('delete', old.Id, old.tag);
                INSERT INTO DocumentTagsSearch(rowid, tag) VALUES (new.Id, new.tag);
            END;

            -- DocumentNotes -> DocumentNotesSearch
            CREATE TRIGGER IF NOT EXISTS document_notes_ai AFTER INSERT ON DocumentNotes BEGIN
                INSERT INTO DocumentNotesSearch(rowid, note) VALUES (new.Id, new.note);
            END;

            CREATE TRIGGER IF NOT EXISTS document_notes_ad AFTER DELETE ON DocumentNotes BEGIN
                INSERT INTO DocumentNotesSearch(DocumentNotesSearch, rowid, note) VALUES('delete', old.Id, old.note);
            END;

            CREATE TRIGGER IF NOT EXISTS document_notes_au AFTER UPDATE ON DocumentNotes BEGIN
                INSERT INTO DocumentNotesSearch(DocumentNotesSearch, rowid, note) VALUES('delete', old.Id, old.note);
                INSERT INTO DocumentNotesSearch(rowid, note) VALUES (new.Id, new.note);
            END;

            -- DocumentKeyPoints -> DocumentKeyPointsSearch
            CREATE TRIGGER IF NOT EXISTS document_keypoints_ai AFTER INSERT ON DocumentKeyPoints BEGIN
                INSERT INTO DocumentKeyPointsSearch(rowid, key_point) VALUES (new.Id, new.key_point);
            END;

            CREATE TRIGGER IF NOT EXISTS document_keypoints_ad AFTER DELETE ON DocumentKeyPoints BEGIN
                INSERT INTO DocumentKeyPointsSearch(DocumentKeyPointsSearch, rowid, key_point) VALUES('delete', old.Id, old.key_point);
            END;

            CREATE TRIGGER IF NOT EXISTS document_keypoints_au AFTER UPDATE ON DocumentKeyPoints BEGIN
                INSERT INTO DocumentKeyPointsSearch(DocumentKeyPointsSearch, rowid, key_point) VALUES('delete', old.Id, old.key_point);
                INSERT INTO DocumentKeyPointsSearch(rowid, key_point) VALUES (new.Id, new.key_point);
            END;

            -- DocumentProcedures -> DocumentProceduresSearch
            CREATE TRIGGER IF NOT EXISTS document_procedures_ai AFTER INSERT ON DocumentProcedures BEGIN
                INSERT INTO DocumentProceduresSearch(rowid, procedure) VALUES (new.Id, new.procedure);
            END;

            CREATE TRIGGER IF NOT EXISTS document_procedures_ad AFTER DELETE ON DocumentProcedures BEGIN
                INSERT INTO DocumentProceduresSearch(DocumentProceduresSearch, rowid, procedure) VALUES('delete', old.Id, old.procedure);
            END;

            CREATE TRIGGER IF NOT EXISTS document_procedures_au AFTER UPDATE ON DocumentProcedures BEGIN
                INSERT INTO DocumentProceduresSearch(DocumentProceduresSearch, rowid, procedure) VALUES('delete', old.Id, old.procedure);
                INSERT INTO DocumentProceduresSearch(rowid, procedure) VALUES (new.Id, new.procedure);
            END;

            -- Medicines -> MedicinesSearch
            CREATE TRIGGER IF NOT EXISTS medicines_ai AFTER INSERT ON Medicines BEGIN
                INSERT INTO MedicinesSearch(rowid, name, dosage, frequency, duration)
                VALUES (new.Id, new.name, new.dosage, new.frequency, new.duration);
            END;

            CREATE TRIGGER IF NOT EXISTS medicines_ad AFTER DELETE ON Medicines BEGIN
                INSERT INTO MedicinesSearch(MedicinesSearch, rowid, name, dosage, frequency, duration)
                VALUES('delete', old.Id, old.name, old.dosage, old.frequency, old.duration);
            END;

            CREATE TRIGGER IF NOT EXISTS medicines_au AFTER UPDATE ON Medicines BEGIN
                INSERT INTO MedicinesSearch(MedicinesSearch, rowid, name, dosage, frequency, duration)
                VALUES('delete', old.Id, old.name, old.dosage, old.frequency, old.duration);
                INSERT INTO MedicinesSearch(rowid, name, dosage, frequency, duration)
                VALUES (new.Id, new.name, new.dosage, new.frequency, new.duration);
            END;

            -- LabTests -> LabTestsSearch
            CREATE TRIGGER IF NOT EXISTS labtests_ai AFTER INSERT ON LabTests BEGIN
                INSERT INTO LabTestsSearch(rowid, name, value, unit, normal_range, status)
                VALUES (new.Id, new.name, new.value, new.unit, new.normal_range, new.status);
            END;

            CREATE TRIGGER IF NOT EXISTS labtests_ad AFTER DELETE ON LabTests BEGIN
                INSERT INTO LabTestsSearch(LabTestsSearch, rowid, name, value, unit, normal_range, status)
                VALUES('delete', old.Id, old.name, old.value, old.unit, old.normal_range, old.status);
            END;

            CREATE TRIGGER IF NOT EXISTS labtests_au AFTER UPDATE ON LabTests BEGIN
                INSERT INTO LabTestsSearch(LabTestsSearch, rowid, name, value, unit, normal_range, status)
                VALUES('delete', old.Id, old.name, old.value, old.unit, old.normal_range, old.status);
                INSERT INTO LabTestsSearch(rowid, name, value, unit, normal_range, status)
                VALUES (new.Id, new.name, new.value, new.unit, new.normal_range, new.status);
            END;

            -- BillingItems -> BillingItemsSearch
            CREATE TRIGGER IF NOT EXISTS billingitems_ai AFTER INSERT ON BillingItems BEGIN
                INSERT INTO BillingItemsSearch(rowid, name, price) VALUES (new.Id, new.name, new.price);
            END;

            CREATE TRIGGER IF NOT EXISTS billingitems_ad AFTER DELETE ON BillingItems BEGIN
                INSERT INTO BillingItemsSearch(BillingItemsSearch, rowid, name, price) VALUES('delete', old.Id, old.name, old.price);
            END;

            CREATE TRIGGER IF NOT EXISTS billingitems_au AFTER UPDATE ON BillingItems BEGIN
                INSERT INTO BillingItemsSearch(BillingItemsSearch, rowid, name, price) VALUES('delete', old.Id, old.name, old.price);
                INSERT INTO BillingItemsSearch(rowid, name, price) VALUES (new.Id, new.name, new.price);
            END;
        `);
        }

        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

        console.log(`Database migrated to version ${DATABASE_VERSION}`);
    }
    catch (error) {
        console.error('Error during database migration:', error);
        throw error;
    }
}