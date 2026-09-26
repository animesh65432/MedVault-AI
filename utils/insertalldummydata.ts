import data from "@/data.json"
import { create_document } from "@/db/document"
import { SQLiteDatabase } from "expo-sqlite"

type DummyRow = {
    title: string
    type: string
    IsPdf: boolean
    risk_level?: string
    patient_name?: string
    date: string
    SourceFilePath: string
    Hash: string
    [key: string]: any
}

export async function seedDummyData(db: SQLiteDatabase) {
    const rows = data as DummyRow[]

    let inserted = 0
    let failed = 0

    for (const row of rows) {
        try {
            const {
                title,
                type,
                IsPdf,
                SourceFilePath,
                Hash,
                CreatedAt,
                UpdatedAt,
                ...rest
            } = row

            const doc = {
                title,
                type,
                document_metadata: rest,
            }

            await create_document(db, doc as any, SourceFilePath, Hash, IsPdf)
            inserted++
        } catch (error) {
            failed++
            console.error(`Failed to insert row "${row.title}":`, error)
        }
    }

    console.log(`Seed complete: ${inserted} inserted, ${failed} failed`)
}