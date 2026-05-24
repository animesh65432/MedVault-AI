import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { vScale } from "@/utils/vScale"
import SearchInput from '../SearchInput'
import { scale } from '@/utils/scale'
import Documents from '../Documents'
import { DocumentsContext } from "@/context/Documents"

const Search: React.FC = () => {
    const { Documents: documentsList } = useContext(DocumentsContext)

    return (
        <View style={styles.container}>
            <SearchInput />
            <Documents
                documents={documentsList}
                IsSearch={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(10),
        paddingTop: vScale(40),
        paddingBottom: vScale(32),
    }
})

export default Search