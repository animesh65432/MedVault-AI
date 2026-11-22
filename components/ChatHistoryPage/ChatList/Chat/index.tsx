import { RecentCoversation } from "@/types"
import { formatDate } from "@/utils/formatDate"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    conversation: RecentCoversation
}

const Chat: React.FC<Props> = ({ conversation }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.ChatContainer}
            onPress={() => router.push(`/Chat?ChatId=${conversation.Id}`)}
        >
            <View style={styles.firstRowCol}>
                <MaterialIcons
                    name="chat"
                    size={scale(28)}
                    color="#085f27"
                />
                <View style={styles.Col}>
                    <Text style={styles.title}>{conversation.Name}</Text>
                    <Text style={styles.dateText}>{formatDate(conversation.CreatedAt)}</Text>
                </View>
            </View>
            <MaterialIcons
                name="arrow-forward-ios"
                size={scale(18)}
            />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    ChatContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBlockColor: "#ece4e4",
        borderBottomWidth: 1,
        paddingBottom: vScale(10),
        paddingVertical: vScale(5),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(22),
        color: "black",
    },
    firstRowCol: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
    },
    dateText: {
        fontFamily: "Aeonik-Regular",
        fontSize: scale(14),
    },
    Col: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(3),
        width: "60%"
    }
})

export default Chat