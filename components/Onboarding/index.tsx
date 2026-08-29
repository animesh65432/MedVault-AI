import { OnboardingContext } from '@/context';
import { UserNameContext } from "@/context/UserName";
import OnboardingStyles from '@blazejkustra/react-native-onboarding';
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Intro from './Intro';

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
            <OnboardingStyles
                introPanel={Intro}
                steps={[]}
                onComplete={async () => {
                    console.log('Onboarding completed!')
                }}
                onSkip={() => console.log('Onboarding skipped')}
                onStepChange={(step) => console.log('Current step:', step)}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Onboarding