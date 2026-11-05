import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { count: number; onAttach: () => void };

const SelectionBar: React.FC<Props> = ({ count, onAttach }) => (
    <View style={styles.Container}>
        <Text style={styles.title}>{count} selected</Text>
        <Pressable style={styles.button} onPress={onAttach}>
            <Text style={styles.text}>Attach</Text>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    Container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: vScale(160),
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        paddingHorizontal: scale(20),
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

    },
    button: {
        backgroundColor: "#0D483F",
        borderRadius: scale(12),
        paddingVertical: scale(14),
        alignItems: "center",
        width: scale(140)
    },
    text: {
        color: "white",
        fontSize: fs(17),
        fontFamily: "Aeonik-Medium"
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(22),
        color: "#0D483F"
    }
});

export default SelectionBar;