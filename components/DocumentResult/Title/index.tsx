import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    title: string;
    type: string;
    isEditable: boolean;
    onTitleChange?: (value: string) => void;
    onTypeChange?: (value: string) => void;
};

const Title: React.FC<Props> = ({ title, type, isEditable, onTitleChange, onTypeChange }) => {
    return (
        <View style={styles.container}>
            <View style={styles.docContainer}>
                <Octicons name="dot-fill" size={fs(10)} color="#234338" />
                {isEditable ? (
                    <TextInput
                        value={type}
                        onChangeText={onTypeChange}
                        style={styles.docTypeInput}
                        placeholder="Document type"
                        placeholderTextColor="rgba(35, 67, 56, 0.4)"
                    />
                ) : (
                    <Text style={styles.docTypeText}>{type}</Text>
                )}
            </View>

            {isEditable ? (
                <TextInput
                    value={title}
                    onChangeText={onTitleChange}
                    style={styles.titleInput}
                    placeholder="Document title"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    multiline
                />
            ) : (
                <Text style={styles.title}>{title}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        gap: scale(6),
    },
    docContainer: {
        backgroundColor: '#E5F0EB',
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: scale(6),
        borderColor: '#D1E0DC',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    docTypeText: {
        color: '#234338',
        fontSize: fs(12),
        lineHeight: fs(12) * 1.4,
        fontFamily: 'Aeonik-Medium',
    },
    docTypeInput: {
        color: '#234338',
        fontSize: fs(12),
        lineHeight: fs(12) * 1.4,
        fontFamily: 'Aeonik-Medium',
        padding: 0,
        minWidth: scale(60),
    },
    title: {
        fontSize: fs(22),
        lineHeight: fs(22) * 1.3,
        fontFamily: 'Aeonik-Medium',
        color: 'white',
    },
    titleInput: {
        fontSize: fs(22),
        lineHeight: fs(22) * 1.3,
        fontFamily: 'Aeonik-Medium',
        color: 'white',
        padding: 0,
        alignSelf: 'stretch',
    },
});

export default Title;