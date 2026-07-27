import TypingDots from "@/components/TypingDots";
import { ChatMessage } from "@/types";
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Markdown from "react-native-markdown-display";
import Sources from "./Sources";

const markdownRules = {
    table: (node: any, children: any, parent: any, styles: any) => (
        <ScrollView
            key={node.key}
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ marginVertical: vScale(8) }}
        >
            <View style={styles.table}>{children}</View>
        </ScrollView>
    ),
};

type Props = {
    item: ChatMessage;
    isAwaitingReply: boolean;
}

const Message: React.FC<Props> = ({ isAwaitingReply, item }) => {
    return (
        <View style={style.exchange}>
            <View style={style.userRow}>
                <View style={style.userBubble}>
                    <Text style={style.userText}>{item.UserMessage}</Text>
                </View>
            </View>

            {isAwaitingReply ? (
                <View style={style.aiRow}>
                    <TypingDots />
                </View>
            ) : item.AIResponse ? (
                <View style={style.aiRow}>
                    <View style={style.aiBubble}>
                        <Markdown style={markdownStyles} rules={markdownRules}>
                            {item.AIResponse}
                        </Markdown>
                        {item.Soucres &&
                            <Sources sources={item.Soucres} />
                        }
                    </View>
                </View>
            ) : null}
        </View>
    )
}

const markdownStyles = StyleSheet.create({
    body: {
        color: "#0D1F1C",
        fontFamily: "Aeonik-Regular",
        fontSize: fs(15),
        lineHeight: fs(22),
    },
    heading1: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(18),
        color: "#0D1F1C",
        marginTop: vScale(4),
        marginBottom: vScale(6),
    },
    heading2: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(16),
        color: "#0D1F1C",
        marginTop: vScale(4),
        marginBottom: vScale(6),
    },
    strong: {
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    bullet_list: {
        marginVertical: vScale(4),
    },
    ordered_list: {
        marginVertical: vScale(4),
    },
    list_item: {
        marginVertical: vScale(2),
    },
    bullet_list_icon: {
        color: "#234338",
    },
    table: {
        borderWidth: 1,
        borderColor: "#0D1F1C20",
        borderRadius: scale(8),
        overflow: "hidden",
    },
    thead: {
        backgroundColor: "#234338",
    },
    th: {
        color: "#FAFAF8",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(12),
        padding: scale(8),
        minWidth: scale(90),
    },
    tr: {
        borderBottomWidth: 1,
        borderColor: "#0D1F1C15",
        flexDirection: "row",
    },
    td: {
        color: "#0D1F1C",
        fontFamily: "Aeonik-Regular",
        fontSize: fs(12),
        padding: scale(8),
        minWidth: scale(90),
    },
    hr: {
        backgroundColor: "#0D1F1C15",
        height: 1,
        marginVertical: vScale(8),
    },
    em: {
        fontStyle: "italic",
        color: "#0D1F1C99",
    },
});

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
        display: "flex",
        flexDirection: "column"
    },
    SpinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})



export default Message