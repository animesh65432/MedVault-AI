import { ChatMessage } from '@/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Messages from '../Messages'
import Header from './Header'

type Props = {
    IsLoading: boolean;
    messages: ChatMessage[];
    AllMessageLoading: boolean;
    SuggestedQuestions: string[];
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

const NonEmpty: React.FC<Props> = ({ setMessage, SuggestedQuestions, IsLoading, messages, AllMessageLoading }) => {
    return (
        <View style={styles.Conainer}>
            <Header />
            <Messages
                IsLoading={IsLoading}
                messages={messages}
                AllMessageLoading={AllMessageLoading}
                SuggestedQuestions={SuggestedQuestions}
                setMessage={setMessage}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Conainer: {
        flex: 1
    }
})

export default NonEmpty 