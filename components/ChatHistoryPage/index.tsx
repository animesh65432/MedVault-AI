import { scale } from '@/utils/scale';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ChatList from "./ChatList";
import Header from './Header';

const ChathistoryPage: React.FC = () => {
    const [query, setQuery] = useState<string>("")
    return (
        <View style={styles.Conatiner}>
            <Header
                query={query}
                setQuery={setQuery}
            />
            <ChatList
                query={query}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Conatiner: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingVertical: scale(20),
        paddingTop: scale(30),
        display: "flex",
        flexDirection: "column",
        gap: scale(15),
    },

})

export default ChathistoryPage