import DeleteDocumentModel from '@/components/DeleteDocumentModel';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    onDelete: () => void;
    IsDeleteLoading: boolean;
    title: string
};

const Navbar: React.FC<Props> = ({ title, IsDeleteLoading, onDelete }) => {
    const [ShowDocumentDeleteConfirmation, setShowDocumentDeleteConfirmation] = useState(false);

    const handleConfirmDelete = () => {
        onDelete();
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <Pressable
                    hitSlop={10}
                    disabled={IsDeleteLoading}
                    onPress={() => router.back()}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={scale(24)}
                        color="#234338"
                    />
                </Pressable>
                <Text style={styles.backText}>{title}</Text>
            </View>

            <Pressable
                hitSlop={10}
                disabled={IsDeleteLoading}
                onPress={() => setShowDocumentDeleteConfirmation(true)}
            >
                {IsDeleteLoading ? (
                    <ActivityIndicator size="small" color="#5F5E5A" />
                ) : (
                    <AntDesign
                        name="delete"
                        size={scale(22)}
                        color="#234338"
                    />
                )}
            </Pressable>

            <DeleteDocumentModel
                visible={ShowDocumentDeleteConfirmation}
                onCancel={() => setShowDocumentDeleteConfirmation(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={IsDeleteLoading}
            />
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
        gap: scale(8),
    },
    backText: {
        color: '#234338',
        fontSize: fs(17),
        fontFamily: 'Aeonik-Medium',
    },
    pressed: {
        opacity: 0.6,
    },
    deleteButton: {
        borderWidth: 1,
        borderColor: '#E5E4DD',
        backgroundColor: '#FAFAF8',
        borderRadius: scale(8),
        padding: scale(8),
        minWidth: scale(34),
        minHeight: scale(34),
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonPressed: {
        backgroundColor: '#FBEEED',
        borderColor: '#F0C9C5',
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
});

export default Navbar;