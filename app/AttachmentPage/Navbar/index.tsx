import { TypesOfDocuments } from "@/utils/constants";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface NavbarProps {
    selected: string;
    onSelect: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selected, onSelect }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            style={styles.scroll}
        >
            {TypesOfDocuments.map((item) => {
                const isActive = item.value === selected;
                return (
                    <Pressable
                        key={item.value}
                        onPress={() => onSelect(item.value)}
                        style={[styles.chip, isActive && styles.chipActive]}
                    >
                        <Text style={[styles.label, isActive && styles.labelActive]}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 0, // stops the ScrollView from stretching vertically
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        paddingVertical: scale(6),
    },
    chip: {
        paddingHorizontal: scale(18),
        paddingVertical: scale(11),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: "#D0D0D0",
        backgroundColor: "#fff",
    },
    chipActive: {
        backgroundColor: "#0D483F",
        borderColor: "#0D483F"
    },
    label: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#333",
    },
    labelActive: {
        color: "#fff",
    },
});

export default Navbar;