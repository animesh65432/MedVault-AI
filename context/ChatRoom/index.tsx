
import { ChatMessage } from "@/types";
import React, { createContext, useState } from "react";

type ChatRoomContextType = {
    Id: number | null;
    Name: string | null;
    Messages: ChatMessage[];
    updateChatRoom: (newChatRoom: ChatRoom) => void;
};

type ChatRoom = {
    Id: number | null;
    Name: string | null;
    Messages: ChatMessage[];
};

const initialChatRoom: ChatRoom = {
    Id: null,
    Name: null,
    Messages: []
};

export const ChatRoomContext = createContext<ChatRoomContextType>({
    ...initialChatRoom,
    updateChatRoom: () => { }
});

type Props = {
    children: React.ReactNode;
};

export const ChatRoomProvider: React.FC<Props> = ({ children }) => {
    const [chatRoom, setChatRoom] = useState<ChatRoom>(initialChatRoom);

    const updateChatRoom = (newChatRoom: ChatRoom) => {
        setChatRoom(newChatRoom);
    };

    return (
        <ChatRoomContext.Provider
            value={{
                ...chatRoom,
                updateChatRoom
            }}
        >
            {children}
        </ChatRoomContext.Provider>
    );
};
