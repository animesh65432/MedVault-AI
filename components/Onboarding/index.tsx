import { OnboardingContext } from '@/context';
import { UserNameContext } from "@/context/UserName";
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingSwiper from "react-native-onboarding-swiper";
import NameInputScreen from './NameInputScreen';
import ThreeWelcome from './ThreeWelcome';
import TwoWelCome from './Twowelcome';
import WelCome from './welcome';

const Onboarding: React.FC = () => {
    const { OnChangeUserName } = useContext(UserNameContext)
    const [activeIndex, setActiveIndex] = useState(0);
    const { setOnboardingCompleteAndCache } = useContext(OnboardingContext)
    const swiperRef = useRef<OnboardingSwiper>(null);

    const handleDone = async () => {
        await setOnboardingCompleteAndCache(true);
    };

    const handlePageChange = async (index: number) => {
        setActiveIndex(index);
        if (index > 3) {
            await setOnboardingCompleteAndCache(true);
            return;
        }
        swiperRef.current?.goToPage(index, true);
    };

    const handleNameSubmit = async (name: string) => {
        await OnChangeUserName(name);
        handlePageChange(activeIndex + 1);
    };

    return (
        <View style={styles.container}>
            <OnboardingSwiper
                ref={swiperRef}
                onDone={handleDone}
                pages={[
                    {
                        backgroundColor: '#fff',
                        image: <></>,
                        title: <WelCome handlePageChange={handlePageChange} />,
                        subtitle: '',
                    },
                    {
                        backgroundColor: '#fff',
                        image: <></>,
                        title: <TwoWelCome handlePageChange={handlePageChange} />,
                        subtitle: '',
                    },
                    {
                        backgroundColor: '#fff',
                        image: <></>,
                        title: <ThreeWelcome handlePageChange={handlePageChange} />,
                        subtitle: '',
                    },
                    {
                        backgroundColor: '#fff',
                        image: <></>,
                        title: <NameInputScreen
                            isActive={activeIndex === 3}
                            onContinue={handleNameSubmit}
                        />,
                        subtitle: '',
                    },
                ]}
                showPagination={false}
                showSkip={false}
                showNext={false}
                showDone={false}
                bottomBarHeight={0}
                bottomBarColor="transparent"
                containerStyles={{ padding: 0, margin: 0 }}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFD",
        height: "100%",
        width: "100%",
    },
})

export default Onboarding