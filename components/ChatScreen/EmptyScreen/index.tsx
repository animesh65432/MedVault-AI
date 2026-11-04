import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import DummyQuestions from './DummyQuestions'
import Header from './Header'
import HeroSection from './HeroSection'
import RecentConverSations from './RecentConverSations'

const EmptyScreen: React.FC = () => {
    return (
        <View style={styles.Container}>
            <Header />
            <View
                style={styles.BelowContainer}
            >
                <HeroSection />
                <DummyQuestions />
                <RecentConverSations />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        paddingHorizontal: scale(15),
        paddingVertical: vScale(40),
        display: "flex",
        flexDirection: "column",
        gap: vScale(10)
    },
    BelowContainer: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(20),
    }
})

export default EmptyScreen