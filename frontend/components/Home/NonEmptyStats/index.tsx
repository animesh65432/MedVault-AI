import React from 'react'
import { View, StyleSheet } from "react-native"
import { MedicalDocument } from '@/types'
import Upload from './Upload'
import Input from './Input'
import { vScale } from '@/utils/vScale'
import Documents from './Documents'

const NonEmptyStats: React.FC<{ documents: MedicalDocument[] }> = ({ documents }) => {
    return (
        <View style={styles.container}>
            <Input />
            <Upload />
            <Documents documents={documents} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: vScale(3)
    }
})

export default NonEmptyStats 