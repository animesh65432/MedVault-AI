import AsyncStorage from '@react-native-async-storage/async-storage'
import { type SQLiteDatabase } from 'expo-sqlite'

export async function resetAllData(db: SQLiteDatabase) {
    try {
        await db.execAsync('PRAGMA foreign_keys = OFF;')

        await db.withTransactionAsync(async () => {
            await db.execAsync(`
                DELETE FROM DocumentTags;
                DELETE FROM DocumentNotes;
                DELETE FROM DocumentKeyPoints;
                DELETE FROM DocumentProcedures;
                DELETE FROM LabTests;
                DELETE FROM BillingItems;
                DELETE FROM MedicineTiming;
                DELETE FROM Reminders;
                DELETE FROM Medicines;
                DELETE FROM Documents;
                DELETE FROM ChatMessages;
            `)

            await db.execAsync(`DELETE FROM sqlite_sequence;`).catch(() => {
            })
        })

        await db.execAsync('PRAGMA foreign_keys = ON;')

        await AsyncStorage.clear()

        console.log('All app data cleared successfully.')
    } catch (error) {
        console.error('Error resetting data:', error)
        throw error
    }
}