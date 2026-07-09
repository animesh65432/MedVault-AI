import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

type IconLibrary = 'Fontisto' | 'Entypo'

export type DocumentCategory = 'Prescription' | 'Lab Reports' | 'Medical Records'

interface StepItem {
    iconLib: IconLibrary
    iconName: string
    title: DocumentCategory
    description: string
}

const STEPS: StepItem[] = [
    {
        iconLib: 'Fontisto',
        iconName: 'prescription',
        title: 'Prescription',
        description: 'Keep track of your prescription',
    },
    {
        iconLib: 'Entypo',
        iconName: 'lab-flask',
        title: 'Lab Reports',
        description: 'Access your lab test results',
    },
    {
        iconLib: 'Fontisto',
        iconName: 'file-1',
        title: 'Medical Records',
        description: 'Store your medical documents',
    },
]

const StepIcon: React.FC<{ iconLib: IconLibrary; iconName: string }> = ({
    iconLib,
    iconName,
}) => {
    const props = { name: iconName, size: scale(24), color: '#23423B' }
    return iconLib === 'Entypo' ? <Entypo {...props} /> : <Fontisto {...props} />
}

const Steps: React.FC = () => {
    const router = useRouter()

    const handlePress = (category: DocumentCategory) => {
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                What can you Upload?
            </Text>
            <View style={styles.stepContainer}>
                {STEPS.map((step) => (
                    <TouchableOpacity
                        key={step.title}
                        style={styles.step}
                        activeOpacity={0.6}
                        onPress={() => handlePress(step.title)}
                    >
                        <View style={styles.iconWrapper}>
                            <StepIcon iconLib={step.iconLib} iconName={step.iconName} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            <Text style={styles.stepDescription}>{step.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginRight: 'auto',
        gap: vScale(16),
        marginTop: vScale(20),
    },
    title: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(20),
        color: '#23423B',
        textAlign: 'center',
        lineHeight: vScale(26),
    },
    titleText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(40),
        color: '#23423B',
        textAlign: 'center',
        lineHeight: vScale(26),
    },
    stepContainer: {
        flexDirection: 'column',
        gap: vScale(12),
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    iconWrapper: {
        width: scale(32),
        alignItems: 'center',
    },
    stepTextContainer: {
        flexDirection: "column"
    },
    stepTitle: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#23423B',
        lineHeight: vScale(20),
    },
    stepDescription: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(13),
        color: '#5A7A74',
        marginTop: vScale(2),
    },
})

export default Steps