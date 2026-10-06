import { DocumentRow } from "@/types"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Navabr from './Navabr'

const AddDocumentsPage: React.FC = () => {
    const [SelectedDocuments, setSelectedDocuments] = useState<DocumentRow[]>([])
    return (
        <View style={styles.container}>
            <Navabr
                SelectedDocuments={SelectedDocuments}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: vScale(40),
        paddingHorizontal: scale(20),
        backgroundColor: "white"
    }
})

export default AddDocumentsPage