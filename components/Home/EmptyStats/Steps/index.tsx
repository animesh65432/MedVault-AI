import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface StepItem {
    label: string
    bg: string
    color: string
    renderIcon: (color: string, size: number) => React.ReactNode
}

const STEPS: StepItem[] = [
    {
        label: 'Prescription',
        bg: '#EAF3DE',
        color: '#3B6D11',
        renderIcon: (color, size) => (
            <FontAwesome5 name="prescription" size={size} color={color} />
        ),
    },
    {
        label: 'Lab report',
        bg: '#F0E7FA',
        color: '#534AB7',
        renderIcon: (color, size) => (
            <Entypo name="lab-flask" size={size} color={color} />
        ),
    },
    {
        label: 'Scan / X-ray',
        bg: '#E6F1FB',
        color: '#185FA5',
        renderIcon: (color, size) => (
            <MaterialCommunityIcons name="radiology-box-outline" size={size} color={color} />
        ),
    },
    {
        label: 'Bill',
        bg: '#FAECE7',
        color: '#993C1D',
        renderIcon: (color, size) => (
            <FontAwesome5 name="receipt" size={size} color={color} />
        ),
    },
    {
        label: 'Discharge',
        bg: '#E1F5EE',
        color: '#0F6E56',
        renderIcon: (color, size) => (
            <FontAwesome5 name="hospital" size={size} color={color} />
        ),
    },
    {
        label: 'Other',
        bg: '#F1EFE8',
        color: '#5F5E5A',
        renderIcon: (color, size) => (
            <Entypo name="dots-three-horizontal" size={size} color={color} />
        ),
    },
]

const Steps: React.FC = () => {
    return (
        <View style={styles.Container}>
            <View style={styles.titleAndSubtitle}>
                <Text style={styles.title}>What can you add?</Text>
                <Text style={styles.description}>Store and organize any kind of medical document.</Text>
            </View>

            <View style={styles.grid}>
                {STEPS.map((step) => (
                    <View key={step.label} style={styles.tile}>
                        <View style={[styles.iconCircle, { backgroundColor: step.bg }]}>
                            {step.renderIcon(step.color, scale(16))}
                        </View>
                        <Text style={styles.tileLabel} numberOfLines={1}>
                            {step.label}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        padding: scale(13),
        borderRadius: scale(16),
        width: "100%",
        gap: vScale(10)
    },
    titleAndSubtitle: {
        gap: vScale(4)
    },
    title: {
        fontSize: scale(15),
        fontFamily: "Aeonik-Medium",
        color: "#0D483F"
    },
    description: {
        fontSize: scale(13),
        fontFamily: "Aeonik-Medium",
        color: "#7A7A6E"
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: vScale(10),
    },
    tile: {
        width: '31%',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(14),
        paddingVertical: vScale(12),
        paddingHorizontal: scale(6),
        alignItems: 'center',
    },
    iconCircle: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(9),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vScale(8),
    },
    tileLabel: {
        fontSize: scale(11),
        fontFamily: 'Aeonik-Medium',
        color: '#2C2C2A',
        textAlign: 'center',
    },
})
export default Steps