import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const DocumentNotFound: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Feather name="file" size={fs(28)} color="#234338" />
            </View>

            <Text style={styles.title}>Document not found</Text>
            <Text style={styles.subtitle}>
                This document may have been deleted or the link is no longer valid.
            </Text>

            <Pressable
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                onPress={() => router.back()}
            >
                <Feather name="arrow-left" size={fs(15)} color="#EEF6A2" />
                <Text style={styles.backText}>Go back</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF8',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(32),
        gap: scale(8),
    },
    iconWrap: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: '#E5F0EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(6),
    },
    title: {
        fontSize: fs(16),
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
    },
    subtitle: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Regular',
        color: '#5F5E5A',
        textAlign: 'center',
        lineHeight: fs(19),
        marginBottom: scale(16),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: '#234338',
        borderRadius: scale(20),
        paddingHorizontal: scale(18),
        paddingVertical: scale(10),
    },
    backText: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Medium',
        color: '#EEF6A2',
    },
    pressed: {
        opacity: 0.6,
    },
});

export default DocumentNotFound;