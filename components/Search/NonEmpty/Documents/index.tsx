import { DocumentRow } from '@/types'
import { scale } from '@/utils/scale'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Document from './Document'

type Props = {
    documents: DocumentRow[]
}

const Documents: React.FC<Props> = ({ documents }) => {
    return (
        <View style={styles.container}>
            {documents.map((doc) => (
                <Document key={doc.Id} doc={doc} />
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