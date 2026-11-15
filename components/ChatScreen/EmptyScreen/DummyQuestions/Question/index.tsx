import { scale } from '@/utils/scale';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onQuestionPress: (question: string) => void;
    question: string;
};

const Question: React.FC<Props> = ({ question, title, subtitle, icon, onQuestionPress }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.Container,
                pressed && { opacity: 0.7 }
            ]}
            onPress={() => onQuestionPress(question)}
        >
            {icon}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "white",
        padding: scale(20),
        borderRadius: scale(24),
        gap: scale(5),
    },
    title: {
        fontSize: scale(18),
        fontFamily: "Aeonik-Bold",
        color: "black",
    },
    subtitle: {
        fontSize: scale(14),
        fontFamily: "Aeonik-Regular",
        color: "#202121",
    },
});

export default Question;