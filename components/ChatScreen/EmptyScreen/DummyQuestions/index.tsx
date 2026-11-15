import { scale } from '@/utils/scale';
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Question from './Question';

const Questions = [
    {
        id: 'report',
        title: "Explain my report",
        subtitle: "Understand your latest reports.",
        question: "Analyze my latest medical reports. Explain the findings, abnormal values, and important health indicators.",
        icon: <Entypo name="text-document" size={scale(40)} color="#085f27" />,
    },
    {
        id: 'medications',
        title: "My medications",
        subtitle: "Review my prescriptions.",
        question: "Show my prescribed medications with their dosage, frequency, and duration.",
        icon: <MaterialCommunityIcons name="pill" size={scale(40)} color="#085f27" />,
    },
    {
        id: 'history',
        title: "Health history",
        subtitle: "Explore previous records.",
        question: "Summarize my medical history, including previous diagnoses, lab tests, and treatments.",
        icon: <MaterialCommunityIcons name="file-clock" size={scale(40)} color="#085f27" />,
    },
    {
        id: 'reminders',
        title: "Reminders",
        subtitle: "Check upcoming doses.",
        question: "Show my upcoming medication reminders with their scheduled dates and times.",
        icon: <MaterialIcons name="calendar-month" size={scale(40)} color="#085f27" />,
    },
];

type Props = {
    onQuestionPress: (question: string) => void;
};

const DummyQuestions: React.FC<Props> = ({ onQuestionPress }) => {
    return (
        <FlatList
            data={Questions}
            numColumns={2}
            style={styles.Container}
            contentContainerStyle={styles.Content}
            columnWrapperStyle={styles.Row}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <Question
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    onQuestionPress={onQuestionPress}
                    question={item.question}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    Container: {
        gap: scale(20),
    },
    Content: {
        gap: scale(20),
    },
    Row: {
        gap: scale(20),
    },
});

export default DummyQuestions;