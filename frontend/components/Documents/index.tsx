import React from 'react'
import { View, Text, StyleSheet } from "react-native"
import { vScale } from '@/utils/vScale'
import Document from './Document'
import { MedicalDocument } from '@/types'

const Documents: React.FC<{ documents: MedicalDocument[], IsSearch?: boolean }> = ({ documents, IsSearch = false }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Documents</Text>
            {documents.slice(0, 3).map((doc) => (
                <Document
                    key={doc.id}
                    document={doc}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: vScale(15),
        gap: vScale(15)
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: vScale(18),
    }
})

export default Documents