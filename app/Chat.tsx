import ChatScreen from '@/components/ChatScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const Chat: React.FC = () => {
    const searchParams = useLocalSearchParams();
    const currentDocument = searchParams.currentDocument as string | undefined;
    const documentId = searchParams.documentId ? parseInt(searchParams.documentId as string, 10) : undefined;
    const ChatId = searchParams.ChatId ? parseInt(searchParams.ChatId as string, 10) : undefined;
    const isDocumentActive = currentDocument === 'true';

    return (
        <ChatScreen
            currentDocument={isDocumentActive}
            documentId={documentId}
            ChatId={ChatId}
        />
    );
};

export default Chat;
