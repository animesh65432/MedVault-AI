import Spinner from "@/components/Spinner";
import { ChatMessage } from "@/types";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import React, { useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Message from "./Message";
import SuggestedQuestionsComponent from "./SuggestedQuestions";

type Props = {
    messages: ChatMessage[];
    IsLoading: boolean;
    AllMessageLoading: boolean;
    SuggestedQuestions: string[];
    setMessage: React.Dispatch<React.SetStateAction<string>>
}
const Messages: React.FC<Props> = ({ setMessage, SuggestedQuestions, AllMessageLoading, messages, IsLoading }) => {
    const listRef = useRef<FlatList>(null);
    const prevLengthRef = useRef(0);
    useEffect(() => {
        if (messages.length > prevLengthRef.current) {
            const newIndex = messages.length - 1;
            requestAnimationFrame(() => {
                listRef.current?.scrollToIndex({
                    index: newIndex,
                    viewPosition: 0,
                    animated: true,
                });
            });
        }
        prevLengthRef.current = messages.length;
    }, [messages, SuggestedQuestions]);

    if (AllMessageLoading) {
        return (
            <View style={style.SpinnerContainer}>
                <Spinner size={scale(32)} color="#234338" />
            </View>
        )
    };

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
            contentContainerStyle={[style.listContent, { paddingBottom: vScale(400) }]}
            onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                    listRef.current?.scrollToIndex({
                        index: info.index,
                        viewPosition: 0,
                        animated: true,
                    });
                }, 100);
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            ListFooterComponent={
                <SuggestedQuestionsComponent
                    SuggestedQuestions={SuggestedQuestions}
                    setMessage={setMessage}
                />
            }
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: scale(32),
        height: scale(32),
    }
})

export default Messages