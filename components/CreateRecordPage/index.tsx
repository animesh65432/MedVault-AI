import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Navabr from './Navabr';

const CreateRecordPage: React.FC = () => {
    const router = useRouter()
    const [UserInput, setUserInput] = useState<{
        title: string,
        description: string
    }>({
        title: "",
        description: ""
    })


    return (
        <View style={styles.container}>
            <Navabr />
            <View style={styles.InputBoxContainer}>
                <TextInput
                    style={styles.titleContainer}
                    placeholder='Add a title'
                    placeholderTextColor={"#23423B"}
                    autoFocus
                    onChangeText={(text) => {
                        setUserInput((prev) => ({
                            ...prev,
                            title: text,
                        }));
                    }}
                />
                <TextInput
                    style={styles.descriptionContainer}
                    placeholder='Add description...'
                    placeholderTextColor={"#23423B"}
                    onChangeText={(text) => {
                        setUserInput((prev) => ({
                            ...prev,
                            description: text
                        }));
                    }}
                />
            </View>

            <TouchableOpacity
                style={styles.Select_PhotosContainer}
                onPress={() => router.push("/AddDocuments")}
            >
                <View>
                    <Entypo
                        name="plus"
                        size={scale(28)}
                        color="#23423B"
                    />
                </View>
                <Text style={styles.selectPhotosText}>Select Photos</Text>
            </TouchableOpacity>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: "column",
        gap: vScale(20),
        paddingHorizontal: scale(20),
        paddingTop: vScale(40),
        paddingBottom: vScale(32),
    },
    InputBoxContainer: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(16),
    },
    titleContainer: {
        borderBlockColor: "#EEF6F2",
        borderWidth: scale(1),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
        fontFamily: "Aeonik-Bold",
        fontSize: scale(38),
    },
    descriptionContainer: {
        borderBlockColor: "#EEF6F2",
        borderWidth: scale(1),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
    },
    Select_PhotosContainer: {
        display: "flex",
        flexDirection: "row",
        gap: scale(12),
        alignItems: "center",
        backgroundColor: "#f6f1f1",
        borderRadius: scale(16),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(20),
        marginTop: vScale(90),
    },
    selectPhotosText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "#23423B"
    }
})

export default CreateRecordPage