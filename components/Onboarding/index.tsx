import { OnboardingContext } from '@/context';
import React, { useContext, useRef } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Intro from "./Intro";
import StepOne from './StepOne';

const OnboardingScreen: React.FC = () => {
    const onboardingRef = useRef<Onboarding>(null);
    const { setOnboardingCompleteAndCache } = useContext(OnboardingContext);

    const finishOnboarding = async () => {
        await setOnboardingCompleteAndCache(true);
    };

    const skipToLastPage = () => {
        onboardingRef.current?.goToPage(1, true);
    };

    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
            source={require('../../assets/images/backgroundImage.png')}
        >
            <Onboarding
                ref={onboardingRef}
                onSkip={finishOnboarding}
                onDone={finishOnboarding}
                bottomBarHighlight={false}
                bottomBarColor="transparent"
                pages={[
                    {
                        backgroundColor: 'transparent',
                        image: <View />,
                        title: <Intro skipToLastPage={skipToLastPage} />,
                        subtitle: '',
                    },
                    {
                        backgroundColor: 'transparent',
                        image: <View />,
                        title: <StepOne />,
                        subtitle: '',
                    }
                ]}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default OnboardingScreen;