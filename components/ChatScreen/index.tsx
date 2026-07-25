import { runSqlRaw } from "@/db/document";
import { useCheckMessageType } from "@/hooks/use-CheckMessageType";
import { useExplainDocumentsWithAiReponse } from "@/hooks/use-ExplainDocumentsWithAiReponse";
import { useGenralAiResponse } from "@/hooks/use-GenralAiResponse";
import { useMakeSqlRaw } from "@/hooks/use-MakeSqlRaw";
import { ChatMessage } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

type Props = {
    type: "Chat" | "Search"
}

const Chat: React.FC<Props> = ({ type }) => {
    const db = useSQLiteContext()
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [IsLoading, setIsLoading] = useState(false);
    const { CheckMessageType } = useCheckMessageType();
    const { MakesqlRaw } = useMakeSqlRaw();
    const { ExplainDocumentsWithAiReponse } = useExplainDocumentsWithAiReponse();
    const { GenralAiResponse } = useGenralAiResponse();

    const handleSendMessage = async (message: string) => {
        setIsLoading(true);
        let count = 0;
        try {
            const messageType = await CheckMessageType(message, false);
            if (messageType === "DATABASE_QUERY") {
                const data = await MakesqlRaw(message);
                if (!data?.sql || data.sql.trim() === "") {
                    return;
                }
                console.log("data", data)
                const docs = await runSqlRaw(db, data.sql);
                if (data.countSql) {
                    let Responsecount = await runSqlRaw(db, data.countSql)
                    count = Responsecount[0].total || 0;
                }
                console.log(count, "count")
                const reponse = await ExplainDocumentsWithAiReponse(message, docs, count, data.table)
                console.log("reponse", reponse)
            }
            else {
                const response = await GenralAiResponse(message)
                console.log("response", response)
            }
        }
        catch (error) {
            console.log("Error handling message:", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    const onSelectTemplate = (template: string) => {
        setMessage(template);
    }

    return (
        <View style={styles.container}>
            <Header />
            <Messages
                IsLoading={IsLoading}
                messages={messages}
                onSelectTemplate={onSelectTemplate}
            />
            <KeyboardStickyView>
                <Footer
                    onSend={handleSendMessage}
                    isSending={IsLoading}
                    message={message}
                    setMessage={setMessage}
                />
            </KeyboardStickyView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    }
})

export default Chat