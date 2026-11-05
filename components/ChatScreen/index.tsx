import { } from "@/db/Chat";
import React, { useState } from "react";
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
    return (
        <View style={styles.Container}>
            {message.trim().length === 0 &&
                <EmptyScreen />
            }
            {message.trim().length > 0 &&
                <NonEmpty />
            }
            <KeyboardStickyView
            >
                <InputBox
                    message={message}
                    setMessage={setMessage}
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