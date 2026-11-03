import React from "react";
import EmptyScreen from "./EmptyScreen";

type Props = {
    currentDocument: boolean;
    documentId: number | undefined;
}

const ChatScreen: React.FC<Props> = ({ currentDocument, documentId }) => {
    return (
        <EmptyScreen />
    )
}

export default ChatScreen