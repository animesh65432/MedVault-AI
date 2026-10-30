import { SelectedDocumentsContext } from '@/context/SelectedDocuments';
import { scale } from '@/utils/scale';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
    handleCreateRecord: () => void;
    IsCreateing: boolean;
}

const Navbar: React.FC<Props> = ({ IsCreateing, handleCreateRecord }) => {
    const { setSelectedDocumentsIds } = useContext(SelectedDocumentsContext);
    const router = useRouter();

    const handleBackPress = () => {
        setSelectedDocumentsIds([]);
        router.back();
    };


    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressed,
                ]}
                hitSlop={8}
                onPress={handleBackPress}
                disabled={IsCreateing}
            >
                <AntDesign
                    name="arrow-left"
                    size={scale(24)}
                    color="#fff"
                />

            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressed,
                ]}
                hitSlop={8}
                onPress={handleCreateRecord}
            >
                <Entypo
                    name="check"
                    size={scale(24)}
                    color={"#fff"}
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
        borderRadius: scale(24),

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
