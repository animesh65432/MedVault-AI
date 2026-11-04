import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyScreen from "./EmptyScreen";
import InputBox from "./InputBox";

type Props = {
    currentDocument: boolean;
    documentId: number | undefined;
}

const ChatScreen: React.FC<Props> = ({ currentDocument, documentId }) => {
    return (
        <View style={styles.Container}>
            <EmptyScreen />
            <InputBox />
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