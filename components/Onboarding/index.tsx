import { OnboardingContext } from '@/context';
import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Intro from "./Intro";

const OnboardingScreen: React.FC = () => {
    const { setOnboardingCompleteAndCache } = useContext(OnboardingContext);

    const finishOnboarding = async () => {
        await setOnboardingCompleteAndCache(true);
    };

    return (
        <ImageBackground
            style={styles.container}
            resizeMode="cover"
            source={require('../../assets/images/backgroundImage.png')}
        >
            <Onboarding
                onSkip={finishOnboarding}
                onDone={finishOnboarding}
                bottomBarHighlight={false}
                bottomBarColor="transparent"
                pages={[
                    {
                        backgroundColor: 'transparent',
                        image: <View />,
                        title: <Intro />,
                        subtitle: '',
                    },
                    {
                        backgroundColor: 'transparent',
                        image: <View />,
                        title: <Intro />,
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