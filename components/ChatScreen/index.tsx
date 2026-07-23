import { useCheckMessageType } from "@/hooks/use-CheckMessageType";
import { useGenralAiResponse } from "@/hooks/use-GenralAiResponse";
import { useMakeSqlRaw } from "@/hooks/use-MakeSqlRaw";
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
    const [IsLoading, setIsLoading] = useState(false);
    const { CheckMessageType } = useCheckMessageType();
    const { MakesqlRaw } = useMakeSqlRaw();
    const { GenralAiResponse } = useGenralAiResponse();

    const handleSendMessage = async (message: string) => {
        setIsLoading(true);
        try {
            const messageType = await CheckMessageType(message, false);
            if (messageType === "DATABASE_QUERY") {
                const sqlRaw = await MakesqlRaw(message);
            }
            else {
                const response = await GenralAiResponse(message)
            }

        } catch (error) {
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Header />
            <Messages
                IsLoading={IsLoading}
                messages={[]}
                onSelectTemplate={(question) => { }}
            />
            <KeyboardStickyView>
                <Footer
                    onSend={handleSendMessage}
                    isSending={IsLoading}
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