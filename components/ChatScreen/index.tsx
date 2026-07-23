import React from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

type Props = {
    type: "Chat" | "Search"
}

const Chat: React.FC<Props> = ({ type }) => {

    return (
        <View style={styles.container}>
            <Header />
            <Messages />
            <KeyboardStickyView>
                <Footer onSend={() => { }} isSending={false} />
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