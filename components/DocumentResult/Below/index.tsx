import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    onEditPress?: () => void;
    onViewOriginalPress: () => void;
};

const Below: React.FC<Props> = ({ onEditPress, onViewOriginalPress }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom || vScale(12) }]}>
            <Pressable
                onPress={onEditPress}
                style={({ pressed }) => [styles.button, styles.editButton, pressed && styles.pressed]}
            >
                <Feather name="edit-2" size={scale(16)} color="#234338" />
                <Text style={styles.editText}>Edit document</Text>
            </Pressable>

            <Pressable
                onPress={onViewOriginalPress}
                style={({ pressed }) => [styles.button, styles.viewButton, pressed && styles.pressed]}
            >
                <MaterialIcons name="image-search" size={scale(18)} color="#EEF6A2" />
                <Text style={styles.viewText}>View original</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        paddingHorizontal: scale(16),
        paddingTop: vScale(20),
        backgroundColor: "#ffffff",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(35, 67, 56, 0.12)",
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(7),
        paddingVertical: vScale(12),
        borderRadius: scale(10),
    },
    editButton: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#234338",
    },
    viewButton: {
        backgroundColor: "#234338",
    },
    pressed: {
        opacity: 0.7,
    },
    editText: {
        color: "#234338",
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
    },
    viewText: {
        color: "#EEF6A2",
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
    },
});

export default Below;