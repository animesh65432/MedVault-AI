import { GetAllChatTitles } from '@/db/Chat';
import { RecentCoversation } from '@/types';
import { vScale } from '@/utils/vScale';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Text } from 'react-native';
import Chat from './Chat';
import ChatSkeleton from './Skeleton';

const PAGE_SIZE = 10;

type Props = {
    query: string;
};

const ChatList: React.FC<Props> = ({ query }) => {
    const db = useSQLiteContext();
    const [messages, setMessages] = useState<RecentCoversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const requestIdRef = useRef(0);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(t);
    }, [query]);

    const loadFirstPage = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        setIsLoading(true);
        const result = (await GetAllChatTitles(db, 1, PAGE_SIZE, debouncedQuery)) ?? [];
        if (requestId !== requestIdRef.current) return;

        pageRef.current = 1;
        hasMoreRef.current = result.length === PAGE_SIZE;
        setMessages(result);
        setIsLoading(false);
    }, [db, debouncedQuery]);

    const loadMore = useCallback(async () => {
        if (isLoading || isLoadingMore || !hasMoreRef.current) return;
        const requestId = requestIdRef.current;
        setIsLoadingMore(true);

        const nextPage = pageRef.current + 1;
        const result = (await GetAllChatTitles(db, nextPage, PAGE_SIZE, debouncedQuery)) ?? [];
        if (requestId !== requestIdRef.current) return;

        pageRef.current = nextPage;
        hasMoreRef.current = result.length === PAGE_SIZE;
        setMessages(prev => [...prev, ...result]);
        setIsLoadingMore(false);
    }, [db, debouncedQuery, isLoading, isLoadingMore]);

    useFocusEffect(
        useCallback(() => {
            loadFirstPage();
        }, [loadFirstPage])
    );

    return (
        <FlatList
            data={messages}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={({ item }) => <Chat conversation={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshing={isLoading && messages.length > 0}
            onRefresh={loadFirstPage}
            ListEmptyComponent={
                isLoading ? (
                    <ChatSkeleton count={8} />
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: vScale(20) }}>
                        {debouncedQuery ? 'No chats match your search' : 'No chats yet'}
                    </Text>
                )
            }
            ListFooterComponent={isLoadingMore ? <ChatSkeleton count={2} /> : null}
        />
    );
};

export default ChatList;