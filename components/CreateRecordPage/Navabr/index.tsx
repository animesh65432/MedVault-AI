import { scale } from '@/utils/scale';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type NavbarProps = {
    onEdit?: () => void;
    onDelete?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
    onEdit,
    onDelete,
}) => {
    const router = useRouter();

    return (
        <View style={styles.container}>

            <Pressable
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressed,
                ]}
                onPress={() => router.push("/Documents")}
                hitSlop={8}
            >
                <AntDesign
                    name="close"
                    size={scale(22)}
                    color="#23423B"
                />
            </Pressable>


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
                    color="#23423B"
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: scale(10),
        paddingBottom: scale(8),

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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

        backgroundColor: '#EEF6F2',
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
