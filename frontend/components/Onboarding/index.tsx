import { OnboardingContext } from '@/context';
import React, { useRef, useContext, useState } from 'react'
import WelCome from './welcome';
import TwoWelCome from './Twowelcome';
import ThreeWelcome from './ThreeWelcome';
import Auth from './Auth';
import { View, StyleSheet } from 'react-native';
import OnboardingSwiper from "react-native-onboarding-swiper"

const Onboarding: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { IsonboardingComplete, setOnboardingComplete } = useContext(OnboardingContext)
    const swiperRef = useRef<OnboardingSwiper>(null);

    const handleDone = () => {
        setOnboardingComplete(true);
    };

    const handlePageChange = (index: number) => {
        if (index > 3) {
            setOnboardingComplete(true);
            return;
        }
        setCurrentPage(index);
        swiperRef.current?.goToPage(index, true);
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
                        title: <Auth onAuthSuccess={handleDone} />,
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