import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';



const InputBox: React.FC = () => {
    const router = useRouter();
    const [message, setMessage] = useState('')
    return (
        <View style={styles.Container}>
            <View style={styles.TextInputContainer}>

                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Ask anything about your medical records..."
                    placeholderTextColor="#8A9994"
                    multiline
                    style={styles.Input}
                />

                <View style={styles.BottomContainer}>
                    <Pressable style={styles.IconButton}>
                        <Entypo
                            name="attachment"
                            size={scale(22)}
                            color="#0D483F"
                            onPress={() => router.push("/AttachmentPage")}
                        />
                    </Pressable>

                    <Pressable
                        style={[
                            styles.SendButton,
                            { opacity: message.trim() ? 1 : 0.5 }
                        ]}
                        disabled={!message.trim()}
                        onPress={() => {
                            console.log(message)
                            setMessage('')
                        }}
                    >
                        <Ionicons
                            name="send-sharp"
                            size={scale(22)}
                            color="white"
                        />
                    </Pressable>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        width: '100%',
        paddingHorizontal: scale(10),
        paddingVertical: scale(20),
        paddingBottom: vScale(60)
    },
    TextInputContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: scale(24),
        padding: scale(12),
        borderWidth: 1,
        borderColor: '#E5EBE8',
    },

    Input: {
        minHeight: scale(45),
        maxHeight: scale(120),
        fontSize: scale(18),
        color: '#173D35',
        textAlignVertical: 'top',
        padding: scale(8),
        fontFamily: "Aeonik-Regular",
    },

    BottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: scale(8),
    },

    IconButton: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center',
    },

    SendButton: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(21),
        backgroundColor: '#0D483F',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default InputBox
