import { OnboardingContext } from '@/context';
import { UserNameContext } from "@/context/UserName";
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import OnboardingStyles from '@blazejkustra/react-native-onboarding';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Intro from './Intro';

const Onboarding: React.FC = () => {
    const { OnChangeUserName } = useContext(UserNameContext)
    const { setOnboardingCompleteAndCache } = useContext(OnboardingContext)

    const handleNameSubmit = async (name: string) => {
        await OnChangeUserName(name);
        await setOnboardingCompleteAndCache(true);
    };

    const OnPressforSkip = async () => {
        await setOnboardingCompleteAndCache(true);
    }

    return (
        <View style={styles.container}>
            <OnboardingStyles
                onSkip={OnPressforSkip}
                introPanel={Intro}
                steps={[
                    {
                        label: "Find Any Report",
                        title: "Find Any Report In Seconds",
                        description: " Search prescriptions, blood tests, scans, and bills instantly using smart document search.",
                        buttonLabel: "Got it , Next",
                        image: require('../../assets/images/step-1.png'),
                        position: "top",

                    },
                    {
                        label: "Ask Questions",
                        title: "Ask Questions About Your Health",
                        description: "Get answers to your health questions from our AI-powered assistant, anytime, anywhere.",
                        buttonLabel: "Got it , Next",
                        image: require('../../assets/images/step-2.png'),
                        position: "top",
                    },
                    {
                        label: "Reminder",
                        title: "Never Miss Your Medication",
                        description:
                            "Set personalized reminders for your medicines and stay consistent with your daily medication schedule.",
                        buttonLabel: "Got it, Next",
                        image: require("../../assets/images/step-3.png"),
                        position: "top",
                    },
                    {
                        label: "Profile & Summary",
                        title: "Your Health, Organized",
                        description: "Generate a doctor-ready PDF with your active medicines and important documents — all in one place.",
                        buttonLabel: "Get Started",
                        image: require("../../assets/images/step-4.png"),
                        position: "bottom",
                    }
                ]}
                onComplete={OnPressforSkip}
                colors={{
                    background: {
                        primary: '#1F4D43',
                        secondary: '#F8F9FA',
                        label: '#E9ECEF',
                        accent: '#1F4D43'
                    },
                    text: {
                        primary: '#1C1C1E',
                        secondary: '#8E8E93',
                        contrast: '#FFFFFF'
                    }
                }}
                animationDuration={800}
                fonts={{
                    introTitle: 'Aeonik-Bold',
                    introSubtitle: 'Aeonik-Medium',
                    stepTitle: 'Aeonik-Medium',
                    stepDescription: 'Aeonik-Regular',
                    primaryButton: 'Aeonik-Medium'
                }}
                skipButton={({ onPress }) => (
                    <TouchableOpacity
                        onPress={onPress}
                        style={styles.closeButton}
                    >
                        <Text
                            style={styles.closeText}>
                            ✕
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        width: scale(40),
        height: scale(40),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E9ECEF',
        borderRadius: scale(14),
        marginLeft: scale(6),
    },
    closeText: {
        fontSize: fs(22),
        color: '#1C1C1E',
        fontFamily: 'Aeonik-Medium',
    },
})

export default Onboarding