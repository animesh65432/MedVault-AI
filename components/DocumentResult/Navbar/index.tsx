import SaveDocumentModel from '@/components/SaveDocumentModel';
import { fs } from '@/utils/fs';
import { scale, } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    saveDocument: () => void;
    isSaving: boolean;
}

const Navbar: React.FC<Props> = ({ saveDocument, isSaving = false }) => {
    const [showSaveModel, setShowSaveModel] = useState(false);

    const handleConfirm = () => {
        setShowSaveModel(false);
        saveDocument();
    };

    return (
        <View style={styles.container}>
            <Pressable
                hitSlop={10}
                onPress={() => router.back()}
                disabled={isSaving}
            >
                <MaterialIcons name="arrow-back" size={scale(22)} color="#234338" />
            </Pressable>

            <Pressable
                hitSlop={10}
                onPress={() => setShowSaveModel(true)}
                disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator size="small" color="#234338" />
                ) : (
                    <Fontisto name="save" size={scale(22)} color="#234338" />
                )}
            </Pressable>

            <SaveDocumentModel
                visible={showSaveModel}
                onCancel={() => setShowSaveModel(false)}
                onConfirm={handleConfirm}
                isSaving={isSaving}
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