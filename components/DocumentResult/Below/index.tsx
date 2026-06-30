import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Below: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Below</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: "#fff",
        borderTopWidth: 1,
    }
})

export default Below