import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

type Props = {
    handleDelete: () => void;
    IsDeleting: boolean
}

const DeleteButton: React.FC<Props> = ({ handleDelete, IsDeleting }) => {
    return (
        <View style={styles.container}>
            <RectButton
                style={[styles.deleteButton, IsDeleting && styles.deleteButtonDisabled]}
                onPress={handleDelete}
                enabled={!IsDeleting}
            >
                {IsDeleting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <>
                        <Ionicons name="trash-outline" size={scale(20)} color="#FFFFFF" />
                        <Text style={styles.deleteText}>Delete</Text>
                    </>
                )}
            </RectButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: scale(80),
        marginBottom: vScale(10),
        marginLeft: scale(8),
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#E53E3E',
        borderRadius: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        gap: vScale(4),
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    deleteText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: fs(11),
        color: '#FFFFFF',
    },
})

export default DeleteButton