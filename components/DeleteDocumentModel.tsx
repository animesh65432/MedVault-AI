import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
};

const DeleteDocumentModel: React.FC<Props> = ({ visible, onCancel, onConfirm, isDeleting }) => {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <Pressable style={styles.backdrop} onPress={isDeleting ? undefined : onCancel}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.iconWrap}>
                        <Feather name="trash-2" size={fs(20)} color="#234338" />
                    </View>

                    <Text style={styles.title}>Delete this document?</Text>
                    <Text style={styles.subtitle}>
                        This will permanently remove the document, its medicines, reminders, and all attached records. This can't be undone.
                    </Text>

                    <View style={styles.buttonRow}>
                        <Pressable
                            style={[styles.cancelButton, isDeleting && styles.disabled]}
                            onPress={onCancel}
                            disabled={isDeleting}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.confirmButton, isDeleting && styles.disabled]}
                            onPress={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator size="small" color="#EEF6A2" />
                            ) : (
                                <Text style={styles.confirmText}>Delete</Text>
                            )}
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(13,31,28,0.4)',
        justifyContent: "space-around",
    },
    sheet: {
        backgroundColor: '#FAFAF8',
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        padding: scale(20),
        gap: scale(10),
    },
    iconWrap: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#E5F0EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(4),
    },
    title: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
    },
    subtitle: {
        fontSize: fs(12.5),
        fontFamily: 'Aeonik-Regular',
        color: '#5F5E5A',
        lineHeight: fs(18),
        marginBottom: scale(8),
    },
    buttonRow: {
        flexDirection: 'row',
        gap: scale(10),
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E4DD',
        borderRadius: scale(20),
        paddingVertical: scale(12),
        alignItems: 'center',
    },
    cancelText: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Medium',
        color: '#234338',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#234338',
        borderRadius: scale(20),
        paddingVertical: scale(12),
        alignItems: 'center',
    },
    confirmText: {
        fontSize: fs(13),
        fontFamily: 'Aeonik-Medium',
        color: '#EEF6A2',
    },
    disabled: {
        opacity: 0.6,
    },
});

export default DeleteDocumentModel;