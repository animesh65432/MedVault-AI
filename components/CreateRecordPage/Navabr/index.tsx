import { scale } from '@/utils/scale';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const Navbar: React.FC<{ light: boolean }> = ({ light }) => {
    const color = light ? "#fff" : "#23423B";
    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressed,
                ]}
                hitSlop={8}
            >
                <Entypo
                    name="check"
                    size={scale(24)}
                    color={"#fff"}
                />
            </Pressable>
            <Pressable
                hitSlop={8}
            >
                <Entypo
                    name="dots-three-vertical"
                    size={scale(24)}
                    color={color}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        marginTop: scale(20),
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },

    iconButton: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(14),

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#23423B',
    },

    deleteButton: {
        backgroundColor: '#FFF1F1',
    },

    pressed: {
        opacity: 0.6,
        transform: [{ scale: 0.96 }],
    },
});

export default Navbar;
