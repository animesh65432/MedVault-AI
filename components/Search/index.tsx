import { scale } from '@/utils/scale'
import { vScale } from "@/utils/vScale"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import SearchInput from '../SearchInput'
import Empty from './Empty'

const Search: React.FC = () => {

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