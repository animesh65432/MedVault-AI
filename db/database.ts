import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 2;

    const result = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );

    let currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 2) {

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Documents (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Title TEXT NOT NULL,
            Name TEXT NOT NULL,
            Content TEXT NOT NULL,
            Type TEXT NOT NULL,
            SourceLink TEXT,
            Document_Metadata TEXT,
            Date DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Medicines (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            DocumentId INTEGER NOT NULL,
            Name TEXT NOT NULL,
            FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
            );
        `);

        currentDbVersion = 2;
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}