import { fs } from '@/utils/fs'
import { scale } from '@/utils/scale'
import { vScale } from '@/utils/vScale'
import Feather from '@expo/vector-icons/Feather'
import React, { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
    onSend: (message: string) => void
    isSending: boolean
}

const Footer: React.FC<Props> = ({ onSend, isSending = false }) => {
    const [message, setMessage] = useState('')
    const insets = useSafeAreaInsets()

    const canSend = message.trim().length > 0 && !isSending

    const handleSend = () => {
        if (!canSend) return
        onSend(message.trim())
        setMessage('')
    }

    return (
        <View style={[styles.container,
        {
            paddingBottom: insets.bottom +
                vScale(10)
        }]}>
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Ask about your medical history..."
                placeholderTextColor="#B4B2A9"
                style={styles.input}
                multiline
                maxLength={500}
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
            />
            <Pressable
                onPress={handleSend}
                disabled={!canSend}
                hitSlop={8}
                style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            >
                <Feather name="arrow-up" size={fs(16)} color="#EEF6A2" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: scale(8),
        paddingHorizontal: scale(14),
        paddingTop: vScale(12),
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: scale(20),
        paddingHorizontal: scale(14),
        paddingVertical: vScale(20),
        fontSize: fs(16),
        fontFamily: 'Aeonik-Regular',
        color: '#0D1F1C',
        maxHeight: vScale(100),
    },
    sendButton: {
        width: scale(46),
        height: scale(56),
        borderRadius: scale(18),
        backgroundColor: '#234338',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.4,
    },
})

export default Footer