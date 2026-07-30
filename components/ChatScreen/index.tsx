import { GetDocumentById, runSqlRaw } from "@/db/document";
import { insertChatMessage, loadChatMessages } from "@/db/message";
import { useCheckMessageType } from "@/hooks/use-CheckMessageType";
import { useExplainDocumentsWithAiReponse } from "@/hooks/use-ExplainDocumentsWithAiReponse";
import { useGenralAiResponse } from "@/hooks/use-GenralAiResponse";
import { useMakeSqlRaw } from "@/hooks/use-MakeSqlRaw";
import { ChatMessage, SourcesTypes, TypeOfDocumenet } from "@/types";
import { fixSources } from "@/utils/fixSources";
import { makeHistoryPayload } from "@/utils/makehistoryPayload";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

type Props = {
    currentDocument: boolean;
    documentId: number | undefined;
}

const Chat: React.FC<Props> = ({ currentDocument, documentId }) => {
    const db = useSQLiteContext();
    const [currentDocumentData, setCurrentDocumentData] = useState<any>(null);
    const [AllMessageLoading, setAllMessageLoading] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [IsLoading, setIsLoading] = useState(false);
    const { CheckMessageType } = useCheckMessageType();
    const { MakesqlRaw } = useMakeSqlRaw();
    const { ExplainDocumentsWithAiReponse } = useExplainDocumentsWithAiReponse();
    const { GenralAiResponse } = useGenralAiResponse();

    const handleSendMessage = async (message: string) => {
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

            console.log("Message Type:", messageType);

            let answerText: string | undefined;
            let hasMore = false;
            let showMoreTable = "";
            let types: TypeOfDocumenet[] = [];
            let sources: SourcesTypes[] = [];


            if (messageType === "DATABASE_QUERY") {
                const data = await MakesqlRaw(message, historyMessages);

                console.log("SQL Data:", data);
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
                        historyMessages
                    );

                    hasMore = totalCount > 3;
                    showMoreTable = data.table ?? "";
                    types = data.types ?? [];
                    sources = fixSources(docs)
                }
            } else if (messageType === "CURRENT_DOCUMENT") {
                if (!currentDocumentData) {
                    answerText = "I couldn't load the open document. Please try again.";
                } else {
                    answerText = await ExplainDocumentsWithAiReponse(
                        message,
                        currentDocumentData,
                        historyMessages
                    );
                }
            }
            else {
                answerText = await GenralAiResponse(message, historyMessages);
            }

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
            console.log("Error handling message:", error);
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

    const fetchDocument = async (id: number) => {
        try {
            const document = await GetDocumentById(db, id);
            if (document) {
                setCurrentDocumentData(document);
            }
        } catch (error) {
            console.log("Error fetching document:", error);
        }
    }

    const onSelectTemplate = (template: string) => {
        setMessage(template);
    };

    const fetchMessages = async () => {
        setAllMessageLoading(true);
        try {
            const loadedMessages = await loadChatMessages(db);
            setMessages(loadedMessages);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setAllMessageLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [db]);

    useEffect(() => {
        if (currentDocument && documentId) {
            fetchDocument(documentId);
        }
    }, [db, currentDocument, documentId]);

    return (
        <View style={styles.container}>
            <Header />
            <Messages
                AllMessageLoading={AllMessageLoading}
                IsLoading={IsLoading}
                messages={messages}
                onSelectTemplate={onSelectTemplate}
            />
            <KeyboardStickyView
                offset={{ closed: 0, opened: 0 }}
            >
                <Footer
                    onSend={handleSendMessage}
                    isSending={IsLoading}
                    message={message}
                    setMessage={setMessage}
                />
            </KeyboardStickyView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
});

export default Chat;