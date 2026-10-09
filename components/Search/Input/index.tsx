import SpechtoText from "@/components/SpeechtoText";
import { RecentSearchContext } from "@/context/RecentSearch";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const InputBox: React.FC<Props> = ({ searchQuery, setSearchQuery }) => {
    const [showModelSpeechToText, setShowModelSpeechToText] = useState(false)
    const { addRecentSearch } = useContext(RecentSearchContext)
    const router = useRouter()

    const onChangeText = (text: string) => {
        setSearchQuery(text)
    }

    const onSubmitEditing = async () => {
        const trimmed = searchQuery.trim()
        if (trimmed.length > 0) {
            addRecentSearch(trimmed)
        }
    }

    return (
        <View style={styles.container}>
            <AntDesign
                name="arrow-left"
                size={scale(22)}
                color="#23423B"
                onPress={() => router.back()}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                value={searchQuery}
                placeholder="Search by document,doctor,hospital ..."
                placeholderTextColor="#5A7A74"
                returnKeyType="search"
                autoFocus
            />
            {searchQuery.length === 0 &&
                <FontAwesome
                    name="microphone"
                    size={scale(22)}
                    color="#23423B"
                    onPress={() => setShowModelSpeechToText((prev) => !prev)}
                />
            }
            {searchQuery.length > 0 &&
                <Ionicons
                    name="close"
                    size={scale(24)}
                    color="#23423B"
                    onPress={() => setSearchQuery("")}
                />
            }
            {showModelSpeechToText &&
                <SpechtoText
                    visible={showModelSpeechToText}
                    setVisible={setShowModelSpeechToText}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: vScale(4),
        gap: scale(8),
    },
    input: {
        flex: 1,
        fontFamily: "Aeonik-Regular",
        fontSize: scale(16),
        color: "#5A7A74",
    },
})

export default InputBox