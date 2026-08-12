import { OnboardingContext } from '@/context';
import { UserNameContext } from "@/context/UserName";
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import NameInputScreen from './NameInputScreen';
import ThreeWelcome from './ThreeWelcome';
import TwoWelCome from './Twowelcome';
import WelCome from './welcome';

const Onboarding: React.FC = () => {
    const { OnChangeUserName } = useContext(UserNameContext)
    const [activeIndex, setActiveIndex] = useState(0);
    const { setOnboardingCompleteAndCache } = useContext(OnboardingContext)
    const pagerRef = useRef<PagerView>(null);

    const handlePageChange = (index: number) => {
        if (index > 3) {
            setOnboardingCompleteAndCache(true);
            return;
        }
        setActiveIndex(index);
        pagerRef.current?.setPage(index);
    };

    const handleNameSubmit = async (name: string) => {
        await OnChangeUserName(name);
        await setOnboardingCompleteAndCache(true);
    };

    return (
        <View style={styles.container}>
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={0}
                onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
            >
                <View key="1" style={styles.page}>
                    <WelCome handlePageChange={handlePageChange} />
                </View>
                <View key="2" style={styles.page}>
                    <TwoWelCome handlePageChange={handlePageChange} />
                </View>
                <View key="3" style={styles.page}>
                    <ThreeWelcome handlePageChange={handlePageChange} />
                </View>
                <View key="4" style={styles.page}>
                    <NameInputScreen
                        isActive={activeIndex === 3}
                        onContinue={handleNameSubmit}
                    />
                </View>
            </PagerView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFD",
        height: "100%",
        width: "100%",
    },
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
})

export default Onboarding