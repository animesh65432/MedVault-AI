import { scale } from '@/utils/scale';
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Question from './Question';

const Questions = [{
    title: "Explain my report",
    subtitle: "Understand results",
    icon: (
        <Entypo
            name="text-document"
            size={scale(44)}
            color="#23423B"
        />
    ),
},
{
    title: "My Medications",
    subtitle: "Check Prescriptions",
    icon: (<MaterialCommunityIcons
        name="pill"
        size={scale(44)}
        color="#23423B"
    />)
},
{
    title: "Health History",
    subtitle: "Explore past records",
    icon: (<MaterialCommunityIcons
        name="file-clock"
        size={scale(44)}
        color="#23423B"
    />)
},
{
    title: "Reminders",
    subtitle: "Upcoming doses",
    icon: (<MaterialIcons
        name="calendar-month"
        size={scale(44)}
        color="#23423B"
    />)
}
]

const DummyQuestions: React.FC = () => {
    return (
        <FlatList
            data={Questions}
            numColumns={2}
            style={styles.Container}
            contentContainerStyle={styles.Content}
            columnWrapperStyle={styles.Row}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
                <Question
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                />
            )}
        />
    )
}

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
})

export default DummyQuestions