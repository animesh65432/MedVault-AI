import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string,
    doc_type: string
}

const Title: React.FC<Props> = ({ title, doc_type }) => {
    return (
        <View style={styles.container}>
            <View style={styles.docContainer}>
                <Octicons name="dot-fill" size={fs(10)} color="#234338" />
                <Text style={styles.docTypeText}>
                    {doc_type}
                </Text>
            </View>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

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
    title: {
        fontSize: fs(22),
        lineHeight: fs(22) * 1.3,
        fontFamily: 'Aeonik-Medium',
        color: '#0D1F1C',
    }
})

export default Title