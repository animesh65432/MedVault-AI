import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    SuggestedQuestions: string[];
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

const SuggestedQuestions: React.FC<Props> = ({ setMessage, SuggestedQuestions }) => {
    if (!SuggestedQuestions || SuggestedQuestions.length === 0) {
        return null;
    }
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.Container}
        >
            {SuggestedQuestions.map((question, index) => (
                <TouchableOpacity
                    onPress={() => setMessage(question)}
                    key={index}
                    style={styles.SuggestedQuestion}
                >
                    <Text style={styles.QuestionText}>{question}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: "row",
        gap: scale(12),
        paddingHorizontal: vScale(16),
    },
    SuggestedQuestion: {
        width: scale(180),
        backgroundColor: "#173D35",
        borderRadius: scale(20),
        justifyContent: "center",
        alignItems: "center",
        padding: scale(14),
    },
    QuestionText: {
        color: "#c7f0aa",
        fontSize: scale(18),
        fontFamily: "Aeonik-Medium",
        lineHeight: vScale(20),
    }
})

export default SuggestedQuestions