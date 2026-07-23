import React from "react"
import { FlatList, StyleSheet, View } from "react-native"
import TemplateQuestions from "../TemplateQuestions"

type Props = {
    messages: string[]
    onSelectTemplate: (question: string) => void;
    IsLoading: boolean
}

const Messages: React.FC<Props> = ({ messages, onSelectTemplate }) => {
    if (messages.length === 0) {
        return (
            <View style={style.TemplateQuestionsContainer}>
                <TemplateQuestions onSelect={onSelectTemplate} />
            </View>
        )
    }

    return (
        <FlatList
            data={messages}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
                <View></View>
            )}
            contentContainerStyle={{ padding: 16, gap: 12 }}
        />
    )
}

const style = StyleSheet.create({
    TemplateQuestionsContainer: {
        flex: 1,
        justifyContent: "flex-end"
    }
})

export default Messages