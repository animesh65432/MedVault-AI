import { RecentCoversation } from "@/types"
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useKeyboardState } from 'react-native-keyboard-controller'
import DummyQuestions from './DummyQuestions'
import Header from './Header'
import HeroSection from './HeroSection'
import RecentConverSations from './RecentConverSations'

type Props = {
    ShowRecentConversations: boolean;
    recentDocuments: RecentCoversation[];
    onQuestionPress: (question: string) => void;
    setChatRecordId: React.Dispatch<React.SetStateAction<number | null>>;
}

const EmptyScreen: React.FC<Props> = ({ onQuestionPress, recentDocuments, ShowRecentConversations, setChatRecordId }) => {
    const isKeyboardVisible = useKeyboardState((state) => state.isVisible);
    return (
        <View style={styles.Container}>
            <Header />
            <View
                style={styles.BelowContainer}
            >
                <HeroSection />
                {!isKeyboardVisible &&
                    <DummyQuestions
                        onQuestionPress={onQuestionPress}
                    />}
                {ShowRecentConversations &&
                    <>
                        {!isKeyboardVisible &&
                            <RecentConverSations
                                recentDocuments={recentDocuments}
                                setChatRecordId={setChatRecordId}
                            />
                        }
                    </>
                }
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