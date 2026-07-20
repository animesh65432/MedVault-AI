import { RecentSearchContext } from '@/context/RecentSearch'
import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import Feather from '@expo/vector-icons/Feather'
import React, { useContext } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type Props = {
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
}

const RecentSearch: React.FC<Props> = ({ setSearchQuery }) => {
    const { recentSearches, clearRecentSearches } = useContext(RecentSearchContext)

    if (recentSearches.length === 0) return null

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    RECENT SEARCHES
                </Text>
                <Pressable hitSlop={8} onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear All</Text>
                </Pressable>
            </View>

            <View style={styles.list}>
                {recentSearches.map((item, index) => (
                    <Pressable
                        key={`${item}-${index}`}
                        style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                        onPress={() => setSearchQuery(item)}
                    >
                        <View style={styles.itemLeft}>
                            <Feather name="clock" size={fs(14)} color="#5A7A74" />
                            <Text style={styles.itemText} numberOfLines={1}>
                                {item}
                            </Text>
                        </View>
                        <Feather name="arrow-up-left" size={fs(14)} color="#5A7A74" />
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: scale(10),
        paddingHorizontal: scale(20),
        marginTop: scale(10),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fs(12),
        fontFamily: 'Aeonik-Medium',
        color: "#3f403f",
    },
    clearText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: '#5A7A74',
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(8),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(10),
        paddingHorizontal: scale(12),
        borderRadius: scale(12),
        backgroundColor: '#daded9',
        borderWidth: 1,
        borderColor: '#EEEEE6',
    },
    itemPressed: {
        backgroundColor: '#EEF6A2',
        opacity: 0.85,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        marginRight: scale(8),
    },
    itemText: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Regular',
        color: '#234338',
    },
})

export default RecentSearch