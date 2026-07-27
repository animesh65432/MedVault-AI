import Spinner from "@/components/Spinner";
import { ChatMessage } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import TemplateQuestions from "../TemplateQuestions";
import Message from "./Message";

type Props = {
    messages: ChatMessage[]
    onSelectTemplate: (question: string) => void;
    IsLoading: boolean;
    AllMessageLoading: boolean
}

const Messages: React.FC<Props> = ({ AllMessageLoading, messages, onSelectTemplate, IsLoading }) => {

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
            data={messages}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={({ item }) => {
                const isAwaitingReply =
                    IsLoading && item.Id === lastId && item.AIResponse === "";

                return (
                    <Message
                        item={item}
                        isAwaitingReply={isAwaitingReply}
                    />
                );
            }}
            contentContainerStyle={style.listContent}
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
    exchange: {
        gap: vScale(10),
    },
    userRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    userBubble: {
        maxWidth: "82%",
        backgroundColor: "#234338",
        borderRadius: scale(18),
        borderBottomRightRadius: scale(4),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(10),
    },
    userText: {
        color: "#FAFAF8",
        fontFamily: "Aeonik-Regular",
        fontSize: fs(15),
        lineHeight: fs(21),
    },
    aiRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    aiBubble: {
        flex: 1,
        maxWidth: "94%",
        backgroundColor: "#FAFAF8",
        borderRadius: scale(18),
        borderTopLeftRadius: scale(4),
        paddingHorizontal: scale(14),
        paddingVertical: vScale(10),
        borderWidth: 1,
        borderColor: "#0D1F1C10",
    },
    SpinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default Messages