import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from "react-native"
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>
}

const Header: React.FC<Props> = ({ query, setQuery }) => {
    const [searchOpen, setSearchOpen] = useState<boolean>(false)
    const router = useRouter()

    const closeSearch = () => {
        setSearchOpen(false)
        setQuery("")
    }

    return (
        <View style={styles.container}>
            {searchOpen ? (
                <>
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={scale(24)}
                        onPress={closeSearch}
                    />
                    <TextInput
                        style={styles.input}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search chats"
                        autoFocus
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <Feather
                            name="x"
                            size={scale(24)}
                            onPress={() => setQuery("")}
                        />
                    )}
                </>
            ) : (
                <>
                    <View style={styles.leftSide}>
                        <MaterialIcons
                            name="arrow-back-ios"
                            size={scale(24)}
                            onPress={() => router.back()}
                        />
                        <Text style={styles.text}>Chat History</Text>
                    </View>
                    <Feather
                        name="search"
                        size={scale(28)}
                        onPress={() => setSearchOpen(true)}
                    />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: vScale(10),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scale(12),
    },
    text: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(24),
    },
    leftSide: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(30),
    },
    input: {
        flex: 1,
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
    },
})

export default Header