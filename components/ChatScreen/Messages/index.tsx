import Spinner from "@/components/Spinner";
import { ChatMessage } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import React, { useEffect, useRef } from "react";
import { FlatList, Keyboard, StyleSheet, View } from "react-native";
import TemplateQuestions from "../TemplateQuestions";
import Message from "./Message";

type Props = {
    messages: ChatMessage[]
    onSelectTemplate: (question: string) => void;
    IsLoading: boolean;
    AllMessageLoading: boolean
}

const Messages: React.FC<Props> = ({ AllMessageLoading, messages, onSelectTemplate, IsLoading }) => {
    const listRef = useRef<FlatList>(null);

    const scrollToBottom = (animated: boolean = true) => {
        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated });
        });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        const sub = Keyboard.addListener("keyboardDidShow", () => {
            scrollToBottom();
        });
        return () => sub.remove();
    }, []);

    if (AllMessageLoading) {
        return (
            <View style={style.SpinnerContainer}>
                <Spinner size={scale(32)} color="#234338" />
            </View>
        )
    }

    if (messages.length === 0) {
        return (
            <View style={style.TemplateQuestionsContainer}>
                <TemplateQuestions onSelect={onSelectTemplate} />
            </View>
        )
    }

    const lastId = messages[messages.length - 1]?.Id;

    return (
        <FlatList
            ref={listRef}
            style={{ flex: 1 }}
            data={messages}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={({ item }) => {
                const isAwaitingReply =
                    IsLoading && item.Id === lastId && item.AIResponse === "";
                return <Message item={item} isAwaitingReply={isAwaitingReply} />;
            }}
            contentContainerStyle={style.listContent}
            onContentSizeChange={() => scrollToBottom(false)}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
        />
    )
}

const style = StyleSheet.create({
    TemplateQuestionsContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    listContent: {
        paddingHorizontal: scale(16),
        paddingVertical: vScale(16),
        gap: vScale(20),
    },
    SpinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default Messages