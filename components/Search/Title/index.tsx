import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    searchQuery: string;
    SearchSuggestionsLength: number
}

const Title: React.FC<Props> = ({ searchQuery }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Results For "{searchQuery}"
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: scale(20),
        paddingRight: scale(20),
        paddingTop: scale(10),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontSize: scale(16),
        fontFamily: "Aeonik-Medium",
        color: "black",
    }
})

export default Title