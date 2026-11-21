import { GetAllChatTitles } from "@/db/Chat";
import { RecentCoversation } from '@/types';
import { scale } from '@/utils/scale';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './Header';

const ChathistoryPage: React.FC = () => {
    const db = useSQLiteContext();
    const [Messages, setMessages] = useState<RecentCoversation[]>([]);

    async function GetChatHistory() {
        try {
            const messages = await GetAllChatTitles(db);
        } catch (error) {

        }
    };


    useFocusEffect(
        useCallback(() => {
            GetChatHistory();
            return () => {
            };
        }, [])
    );
    return (
        <View style={styles.Conatiner}>
            <Header />
        </View>
    )
}

const styles = StyleSheet.create({
    Conatiner: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingVertical: scale(20),
        paddingTop: scale(30),
    },

})

export default ChathistoryPage