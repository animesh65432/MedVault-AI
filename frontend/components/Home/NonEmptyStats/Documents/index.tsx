import React from 'react'
import { View, Text, StyleSheet } from "react-native"
import { vScale } from '@/utils/vScale'
import Document from '../Document'
import { MedicalDocument } from '@/types'

const Documents: React.FC<{ documents: MedicalDocument[] }> = ({ documents }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Documents</Text>
            {documents.map((doc) => (
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
        fontFamily: "Aeonik-Medium"
    }
})

export default Documents