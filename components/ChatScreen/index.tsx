import { NetworkContext } from "@/context/Netwrok";
import { UserNameContext } from "@/context/UserName";
import { runSqlRaw } from "@/db/document";
import { insertChatMessage } from "@/db/message";
import { useCheckMessageType } from "@/hooks/use-CheckMessageType";
import { useExplainDocumentsWithAiReponse } from "@/hooks/use-ExplainDocumentsWithAiReponse";
import { useGenralAiResponse } from "@/hooks/use-GenralAiResponse";
import { useGiveChatName } from "@/hooks/use-GiveChatName";
import { useMakeSqlRaw } from "@/hooks/use-MakeSqlRaw";
import { SourcesTypes, TypeOfDocumenet } from "@/types";
import { fixSources } from "@/utils/fixSources";
import { makeHistoryPayload } from "@/utils/makehistoryPayload";
import { useSQLiteContext } from "expo-sqlite";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import EmptyScreen from "./EmptyScreen";
import InputBox from "./InputBox";
import NonEmpty from "./NonEmpty";

type Props = {
    currentDocument: boolean;
    documentId: number | undefined;
}

type ChatMessage = {
    Id: number;
    UserMessage: string;
    AIResponse: string;
    ShowMore: boolean;
    TableName: string;
    Types: TypeOfDocumenet[];
    Soucres: SourcesTypes[];
    CreatedAt: string;
};

const ChatScreen: React.FC<Props> = ({ currentDocument, documentId }) => {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const db = useSQLiteContext();
    const { GiveChatName } = useGiveChatName();
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const { CheckMessageType } = useCheckMessageType();
    const { MakesqlRaw } = useMakeSqlRaw();
    const { ExplainDocumentsWithAiReponse } = useExplainDocumentsWithAiReponse();
    const { GenralAiResponse } = useGenralAiResponse();
    const { userName } = useContext(UserNameContext)
    const { isOnline } = useContext(NetworkContext);

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
            let ChatName: string | null = null

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

                    console.log("answerText:", answerText);

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

            ChatName = await GiveChatName(message);

            const finalAnswer = answerText ?? "Something went wrong. Please try again.";

            const insertedId = await insertChatMessage(
                db,
                message,
                finalAnswer,
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

    return (
        <View style={styles.Container}>
            {message.length === 0 &&
                <EmptyScreen />
            }
            {message.length > 0 &&
                <NonEmpty />
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