import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Entypo from 'react-native-vector-icons/Entypo'
import { View, StyleSheet, Text } from 'react-native'

type IconLibrary = 'Fontisto' | 'Entypo'

interface StepItem {
    iconLib: IconLibrary
    iconName: string
    title: string
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
    {
        iconLib: 'Fontisto',
        iconName: 'heartbeat-alt',
        title: 'Health Vitals',
        description: 'Monitor your health metrics',
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
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>What can you Upload?</Text>
            <View style={styles.stepContainer}>
                {STEPS.map((step) => (
                    <View key={step.iconName} style={styles.step}>
                        <View style={styles.iconWrapper}>
                            <StepIcon iconLib={step.iconLib} iconName={step.iconName} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            <Text style={styles.stepDescription}>{step.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 'auto',
        gap: vScale(16),
    },
    titleText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(20),
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
        flex: 1,
    },
    stepTitle: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(15),
        color: '#23423B',
    },
    stepDescription: {
        fontFamily: 'Aeonik-Regular',
        fontSize: scale(13),
        color: '#5A7A74',
        marginTop: vScale(2),
    },
})

export default Steps