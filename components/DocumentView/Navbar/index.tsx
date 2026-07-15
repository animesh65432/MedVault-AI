import { fs } from '@/utils/fs';
import { scale, } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const Navbar: React.FC = () => {
    return (
        <View style={styles.container}>
            <Pressable
                hitSlop={10}
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <MaterialIcons name="arrow-back" size={scale(22)} color="#234338" />
                <Text style={styles.backText}>Back</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        gap: scale(8),
        justifyContent: 'space-between',
        marginTop: vScale(40),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        borderWidth: 1,
        borderColor: '#234338',
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        paddingVertical: vScale(6),
    },
    pressed: {
        opacity: 0.6,
    },
    backText: {
        color: '#234338',
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
    },
});

export default Navbar;