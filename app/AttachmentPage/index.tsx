import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Documents from './Documents';
import Navbar from './Navbar';

const AttachmentPage: React.FC = () => {
    const [selected, setSelected] = useState("All Types")
    const router = useRouter()
    return (
        <View style={styles.Container}>
            <View style={styles.Navbar}>
                <AntDesign
                    name="left"
                    size={scale(24)}
                    color="black"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>Attach Documents</Text>
            </View>
            <Navbar
                selected={selected}
                onSelect={(value) => setSelected(value)}
            />
            <Documents />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        width: "100%",
        height: "100%",
        paddingHorizontal: scale(20),
        paddingVertical: scale(40),
        display: "flex",
        flexDirection: "column",
        gap: scale(10)
    },
    title: {
        fontSize: fs(24),
        fontFamily: "Aeonik-Medium"
    },
    Navbar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: scale(30)
    }
})

export default AttachmentPage