import { SelectedDocumentsContext } from '@/context/SelectedDocuments';
import { DocumentRow } from '@/types';
import { formatDate } from "@/utils/formatDate";
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Doucuments from "./Documents";
import Navabr from './Navabr';

function getSelectedDocumentsDateRange(
    documents: DocumentRow[]
): { oldestDate: string; newestDate: string } | null {
    if (documents.length === 0) return null;

    const getDate = (document: DocumentRow) =>
        document.date ?? document.CreatedAt;

    let oldestDate = getDate(documents[0]);
    let newestDate = getDate(documents[0]);

    for (const document of documents) {
        const currentDate = getDate(document);

        if (currentDate.localeCompare(oldestDate) < 0) {
            oldestDate = currentDate;
        }

        if (currentDate.localeCompare(newestDate) > 0) {
            newestDate = currentDate;
        }
    }

    return { oldestDate, newestDate };
}

const CreateRecordPage: React.FC = () => {
    const { height } = Dimensions.get('window');
    const [SelectedIds, setSelectedIds] = useState<number[]>([]);
    const { SelectedDocuments } = useContext(SelectedDocumentsContext);
    const router = useRouter();
    const [Title, setTitle] = useState<string>("");

    const hasImage = SelectedDocuments.length > 0 && !SelectedDocuments[0].IsPdf;
    const heroHeight = height * 0.8;
    const textColor = hasImage ? "#fff" : "#23423B";
    const dateRange = getSelectedDocumentsDateRange(SelectedDocuments);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ gap: vScale(20) }}
        >
            <View style={{ height: heroHeight }}>
                {hasImage && (
                    <>
                        <Image
                            source={{ uri: SelectedDocuments[0].SourceFilePath }}
                            style={styles.RecordIntroImage}
                            resizeMode="cover"
                        />
                        <View pointerEvents="none" style={styles.overlay} />
                    </>
                )}

                <Navabr light={hasImage} />

                <View style={styles.InputBoxContainer}>
                    <TextInput
                        style={[styles.titleContainer, { color: textColor }]}
                        placeholder="Add a title"
                        placeholderTextColor={hasImage ? "rgba(255,255,255,0.7)" : "#23423B"}
                        autoFocus
                        onChangeText={setTitle}
                    />
                </View>

                <TouchableOpacity
                    style={styles.Select_PhotosContainer}
                    onPress={() => router.push("/AddDocuments")}
                >
                    <Entypo name="camera" size={scale(28)} color="#23423B" />
                    <Text style={styles.selectPhotosText}>Select Photos</Text>
                </TouchableOpacity>

                {SelectedDocuments.length > 0
                    &&
                    <View style={styles.descriptionContainer}>
                        {dateRange &&
                            <Text style={{ color: textColor }}>
                                {formatDate(dateRange.oldestDate)} - {formatDate(dateRange.newestDate)}
                            </Text>
                        }
                    </View>
                }
            </View>

            <Doucuments
                documents={SelectedDocuments}
                SelectedIds={SelectedIds}
                setSelectedIds={setSelectedIds}
            />
        </ScrollView>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: "column",
        gap: vScale(20),
    },
    InputBoxContainer: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(16),
        marginTop: vScale(50),
        paddingHorizontal: scale(10)
    },
    titleContainer: {
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
        fontFamily: "Aeonik-Medium",
        fontSize: scale(60),
        color: "#23423B",
    },
    descriptionContainer: {
        paddingHorizontal: scale(16),
        paddingVertical: vScale(12),
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        display: "flex",
        marginHorizontal: "auto",
        alignSelf: "flex-end",
        marginTop: "auto"
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
        marginTop: vScale(20),
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
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
        height: "100%",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})

export default CreateRecordPage
