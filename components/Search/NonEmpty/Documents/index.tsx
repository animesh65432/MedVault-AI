import { DocumentRow } from '@/types'
import { scale } from '@/utils/scale'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Document from './Document'

type Props = {
    documents: DocumentRow[];
    selectedIds: number[]
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
}

const Documents: React.FC<Props> = ({ documents, selectedIds, setSelectedIds }) => {
    return (
        <View style={styles.container}>
            {documents.map((doc) => (
                <Document
                    key={doc.Id}
                    doc={doc}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(10),
        flex: 1
    }
})

export default Documents