import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { vScale } from "@/utils/vScale"
import SearchInput from '../SearchInput'
import { scale } from '@/utils/scale'
import Documents from '../Documents'
import { DocumentsContext } from "@/context/Documents"
import Empty from './Empty'

const Search: React.FC = () => {
    const { Documents: documentsList } = useContext(DocumentsContext)

    return (
        <View style={styles.container}>
            <SearchInput />
            <Empty />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(20),
        paddingTop: vScale(80),
        paddingBottom: vScale(32),
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: vScale(60)
    }
})

export default Search