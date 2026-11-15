import { NetworkContext } from "@/context/Netwrok";
import { UserNameContext } from "@/context/UserName";
import { GetRecentDocument, createChatRecord } from "@/db/Chat";
import { runSqlRaw } from "@/db/document";
import { insertChatMessage, loadChatMessages } from "@/db/message";
import { useCheckMessageType } from "@/hooks/use-CheckMessageType";
import { useExplainDocumentsWithAiReponse } from "@/hooks/use-ExplainDocumentsWithAiReponse";
import { useGenralAiResponse } from "@/hooks/use-GenralAiResponse";
import { useGiveChatName } from "@/hooks/use-GiveChatName";
import { useMakeSqlRaw } from "@/hooks/use-MakeSqlRaw";
import { ChatMessage, RecentCoversation, SourcesTypes, TypeOfDocumenet } from "@/types";
import { fixSources } from "@/utils/fixSources";
import { makeHistoryPayload } from "@/utils/makehistoryPayload";
import { useSQLiteContext } from "expo-sqlite";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import EmptyScreen from "./EmptyScreen";
import InputBox from "./InputBox";
import NonEmpty from "./NonEmpty";

type Props = {
    currentDocument: boolean;
    documentId: number | undefined;
}

const ChatScreen: React.FC<Props> = ({ currentDocument, documentId }) => {
    const [message, setMessage] = useState("");
    const [RecentDocuments, setRecentDocuments] = useState<RecentCoversation[]>([]);
    const [chatRecordId, setChatRecordId] = useState<number | null>(null);
    const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const db = useSQLiteContext();
    const [ShowRecentConversations, setShowRecentConversations] = useState<boolean>(false);
    const { GiveChatName } = useGiveChatName();
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [AllMessageLoading, setAllMessageLoading] = useState(false);
    const { CheckMessageType } = useCheckMessageType();
    const { MakesqlRaw } = useMakeSqlRaw();
    const { ExplainDocumentsWithAiReponse } = useExplainDocumentsWithAiReponse();
    const { GenralAiResponse } = useGenralAiResponse();
    const { userName } = useContext(UserNameContext)
    const { isOnline } = useContext(NetworkContext);


    async function fetchRecentDocument() {
        try {
            const recent_documents = await GetRecentDocument(db);
            if (recent_documents) {
                setShowRecentConversations(true)
                setRecentDocuments(recent_documents)
            }
            else {
                setShowRecentConversations(false)
            }
        } catch (error) {
            console.log("Error fetching recent documents:", error);
        }
    }

    const handleSendMessage = async () => {
        if (!isOnline) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    Id: Date.now(),
                    UserMessage: message,
                    AIResponse: "No internet connection. Please check your connection and try again.",
                    ShowMore: false,
                    TableName: "",
                    Types: [],
                    Soucres: [],
                    CreatedAt: new Date().toISOString(),
                },
            ]);
            return;
        }
        setIsLoading(true);
        setHasSentMessage(true);
        const tempId = Date.now();
        const historyMessages = makeHistoryPayload(messages);
        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    Id: tempId,
                    UserMessage: message,
                    AIResponse: "",
                    ShowMore: false,
                    TableName: "",
                    Types: [],
                    Soucres: [],
                    CreatedAt: new Date().toISOString(),
                },
            ]);

            const messageType = await CheckMessageType(message, currentDocument);

            let answerText: string | undefined;
            let hasMore = false;
            let showMoreTable = "";
            let types: TypeOfDocumenet[] = [];
            let sources: SourcesTypes[] = [];
            let ChatName: string | null = null;
            let ChatRecordId: number | null = chatRecordId;

            if (messageType === "DATABASE_QUERY") {
                const data = await MakesqlRaw(message, historyMessages);

                if (!data?.sql || data.sql.trim() === "") {
                    answerText = "Sorry, I couldn't find matching records for that.";
                } else {
                    const docs = await runSqlRaw(db, data.sql);
                    let totalCount = 0;

                    if (data.countSql) {
                        const countResult = await runSqlRaw(db, data.countSql);
                        totalCount = countResult?.[0]?.total ?? 0;
                    }

                    answerText = await ExplainDocumentsWithAiReponse(
                        message,
                        docs,
                        userName,
                        historyMessages
                    );

                    hasMore = totalCount > 3;
                    showMoreTable = data.table ?? "";
                    types = data.types ?? [];
                    sources = fixSources(docs)
                }
            } else if (messageType === "CURRENT_DOCUMENT") {
                if (!currentDocument) {
                    answerText = "I couldn't load the open document. Please try again.";
                } else {
                    answerText = await ExplainDocumentsWithAiReponse(
                        message,
                        currentDocument,
                        userName,
                        historyMessages
                    );

                }
            }
            else {
                answerText = await GenralAiResponse(message, userName, historyMessages);
            }

            if (!chatRecordId) {
                ChatName = await GiveChatName(message)
                ChatRecordId = await createChatRecord(db, ChatName ?? "New Chat");
                setChatRecordId(ChatRecordId);
            }

            if (ChatRecordId === null) {
                throw new Error("Failed to create chat record");
            }

            const finalAnswer = answerText ?? "Something went wrong. Please try again.";

            const insertedId = await insertChatMessage(
                db,
                message,
                finalAnswer,
                ChatRecordId,
                hasMore,
                showMoreTable,
                types,
                sources
            );

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.Id === tempId
                        ? {
                            ...msg,
                            Id: insertedId,
                            AIResponse: finalAnswer,
                            ShowMore: hasMore,
                            TableName: showMoreTable,
                            Types: types,
                            Soucres: sources,
                        }
                        : msg
                )
            );

        } catch (error) {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.Id === tempId
                        ? {
                            ...msg,
                            AIResponse: "Error processing your message. Please try again.",
                        }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!chatRecordId) {
            return null;
        }
        setAllMessageLoading(true);
        try {
            const loadedMessages = await loadChatMessages(db, chatRecordId);
            setMessages(loadedMessages);
        } finally {
            setAllMessageLoading(false);
        }
    };


    useEffect(() => {
        fetchRecentDocument()
    }, [])

    useEffect(() => {
        fetchMessages();
    }, [chatRecordId])

    const onQuestionPress = (question: string) => {
        setMessage(question);
    };

    const showEmptyScreen = hasSentMessage === false && chatRecordId === null;

    return (
        <View style={styles.Container}>
            {showEmptyScreen &&
                <EmptyScreen
                    setChatRecordId={setChatRecordId}
                    onQuestionPress={onQuestionPress}
                    recentDocuments={RecentDocuments}
                    ShowRecentConversations={ShowRecentConversations}
                />
            }
            {!showEmptyScreen &&
                <NonEmpty
                    IsLoading={IsLoading}
                    messages={messages}
                    AllMessageLoading={AllMessageLoading}
                />
            }
            <KeyboardStickyView
            >
                <InputBox
                    message={message}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                />
            </KeyboardStickyView>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F9F9F9"
    }
})

export default ChatScreen