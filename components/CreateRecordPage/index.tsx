import { SelectedDocumentsContext } from '@/context/SelectedDocuments';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Navabr from './Navabr';

const CreateRecordPage: React.FC = () => {
    const { SelectedDocuments } = useContext(SelectedDocumentsContext)
    const router = useRouter()
    const [Title, setTitle] = useState<string>("")

    const hasSelectedDocuments = SelectedDocuments.length > 0

    console.log("hasSelectedDocuments-2", !SelectedDocuments[0].IsPdf);

    return (
        <View style={styles.container}>
            {
                hasSelectedDocuments && !SelectedDocuments[0].IsPdf &&
                <Image
                    source={{ uri: SelectedDocuments[0].SourceFilePath }}
                    style={styles.RecordIntroImage}
                    resizeMode="stretch"
                />
            }
            <Navabr />
            <View style={styles.InputBoxContainer}>
                <TextInput
                    style={styles.titleContainer}
                    placeholder='Add a title'
                    placeholderTextColor={"#23423B"}
                    autoFocus
                    onChangeText={(text) => {
                        setTitle(text)
                    }}
                />
            </View>

            <TouchableOpacity
                style={styles.Select_PhotosContainer}
                onPress={() => router.push("/AddDocuments")}
            >
                <View>
                    <Entypo
                        name="camera"
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
        position: "relative"
    },
    InputBoxContainer: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(16),
        marginTop: vScale(50)
    },
    titleContainer: {
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
        fontFamily: "Aeonik-Medium",
        fontSize: scale(60),
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
        marginTop: vScale(10)
    },
    selectPhotosText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(20),
        color: "#23423B"
    },
    RecordIntroImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "80%",
    },
})

export default CreateRecordPage
