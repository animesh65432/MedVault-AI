import { SelectedDocumentsContext } from '@/context/SelectedDocuments';
import { GetAllDocumentsByDocumentIds } from '@/db/document';
import { CheckRecordExists, CreateRecord } from '@/db/Record';
import { usePdfThumbnail } from '@/hooks/usePdfThumbnail';
import { DocumentRow } from '@/types';
import { formatDate } from "@/utils/formatDate";
import { fs } from '@/utils/fs';
import { getSelectedDocumentsDateRange } from '@/utils/getSelectedDocumentsDateRange';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import DocumentsSkeleton from '../DocumentsSkeleton';
import Doucuments from "./Documents";
import Navabr from './Navabr';
import SelectionModeNavbar from './SelectionModeNavbar';

const CreateRecordPage: React.FC = () => {
    const { height } = Dimensions.get('window');
    const navigation = useNavigation();
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [Documents, setDocuments] = useState<DocumentRow[]>([]);
    const db = useSQLiteContext();
    const [IsCreateing, setIsCreateing] = useState<boolean>(false);
    const [SelectedIds, setSelectedIds] = useState<number[]>([]);
    const router = useRouter();
    const [Title, setTitle] = useState<string>("");
    const { SelectedDocumentsIds, setSelectedDocumentsIds } = useContext(SelectedDocumentsContext)
    const hasImage = Documents.length > 0 && !Documents[0].IsPdf;
    const hasPdf = Documents.length > 0 && !!Documents[0].IsPdf;
    const { thumbUri, thumbFailed } = usePdfThumbnail(Documents[0]?.SourceFilePath ?? '', Documents[0]?.IsPdf);
    const heroHeight = height * 0.8;
    const textColor = hasImage ? "#fff" : "#23423B";
    const dateRange = getSelectedDocumentsDateRange(Documents);

    const SelectionMode = SelectedIds.length > 0;

    const removeSelectedDocuments = () => {
        if (SelectedIds.length === 0) return;
        const remainingDocuments = Documents.filter(doc => !SelectedIds.includes(doc.Id));
        setDocuments(remainingDocuments);
        setSelectedDocumentsIds(prev => prev.filter(id => !SelectedIds.includes(id)));
        setSelectedIds([]);
    }

    const fetchDocuments = async () => {
        if (SelectedDocumentsIds.length === 0) {
            setDocuments([]);
            return;
        }

        const isInitialLoad = Documents.length === 0;
        if (isInitialLoad) setIsLoading(true);

        try {
            const count = Math.max(Documents.length, 9);
            const documents = await GetAllDocumentsByDocumentIds(
                db,
                SelectedDocumentsIds.slice(0, count)
            );
            setDocuments(documents);
        }
        catch (error) {
            console.error("Failed to fetch documents:", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDocuments();
    }, [SelectedDocumentsIds]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            setSelectedDocumentsIds([]);
        });
        return unsubscribe;
    }, [navigation]);

    const ShowdefultPdf = thumbFailed && hasPdf;

    const handleCreateRecord = async () => {
        if (Title.trim() === "") {
            Toast.show({
                type: "error",
                text1: "Please enter a title for the record."
            })
            return;
        }
        else if (Documents.length === 0) {
            Toast.show({
                type: "error",
                text1: "didn't select any documents to create a record."
            })
            return;
        }
        setIsCreateing(true);
        try {
            const recordExists = await CheckRecordExists(db, Title);
            if (recordExists) {
                Toast.show({
                    type: "error",
                    text1: "A record with this title already exists. Please choose a different title."
                });
                return;
            }
            await CreateRecord(db, Title, SelectedDocumentsIds);
            router.replace("/Documents")
            Toast.show({
                type: "success",
                text1: "Record created successfully!"
            });

            setDocuments([]);

        } catch (error) {
            console.error("Failed to create record:", error);
            Toast.show({
                type: "error",
                text1: "Failed to create record."
            });
        }
        finally {
            setIsCreateing(false);
        }
    }

    const loadMoreDocuments = async () => {
        if (isLoadingMore) return;
        if (SelectedDocumentsIds.length === 0) return;
        if (Documents.length >= SelectedDocumentsIds.length) return;

        setIsLoadingMore(true);
        try {
            const currentCount = Documents.length;

            const nextDocuments = await GetAllDocumentsByDocumentIds(
                db,
                SelectedDocumentsIds.slice(currentCount, currentCount + 9)
            );
            setDocuments(prev => {
                const existing = new Set(prev.map(d => d.Id));
                const fresh = nextDocuments.filter(d => !existing.has(d.Id));
                return [...prev, ...fresh];
            });
        } catch (error) {
            console.error("Failed to load more documents:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
                style={styles.stickyNav}
                pointerEvents="box-none"
            >
                {
                    SelectionMode &&
                    <SelectionModeNavbar
                        removeSelectedDocuments={removeSelectedDocuments}
                    />
                }
                {!SelectionMode &&
                    <Navabr
                        handleCreateRecord={handleCreateRecord}
                        IsCreateing={IsCreateing}
                    />
                }
            </View>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ gap: vScale(20) }}
                onScroll={loadMoreDocuments}
            >
                <View
                    style={{
                        height: heroHeight,
                        backgroundColor: ShowdefultPdf ? "#EEF6A2" : "transparent",
                        position: "relative"
                    }}
                >
                    {hasImage && (
                        <>
                            <Image
                                source={{ uri: Documents[0].SourceFilePath }}
                                style={styles.RecordIntroImage}
                                resizeMode="stretch"
                            />
                            <View pointerEvents="none" style={styles.overlay} />
                        </>
                    )}
                    {hasPdf && thumbUri && <>
                        <Image
                            source={{ uri: thumbUri }}
                            style={styles.RecordIntroImage}
                            resizeMode="stretch"
                        />
                        <View pointerEvents="none" style={styles.overlay} />
                    </>
                    }
                    <View style={styles.InputBoxContainer}>
                        <TextInput
                            style={[styles.titleContainer, { color: textColor }]}
                            placeholder="Add a title"
                            value={Title}
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
                    {
                        ShowdefultPdf &&
                        <View style={styles.pdfPlaceholder}>
                            <View style={styles.pdfIcon}>
                                <Text style={styles.pdfIconText}>PDF</Text>
                            </View>
                            <Text style={styles.previewFallbackText}>
                                {Documents[0].title}
                            </Text>
                        </View>
                    }

                    {Documents.length > 0
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
                {IsLoading
                    ? <DocumentsSkeleton count={9} />
                    : <Doucuments
                        documents={Documents}
                        SelectedIds={SelectedIds}
                        setSelectedIds={setSelectedIds}
                        SelectionMode={SelectionMode}
                    />}
                {isLoadingMore && <DocumentsSkeleton count={3} />}
            </ScrollView>
        </View>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: "column",
        gap: vScale(20),
        position: "relative"
    },
    InputBoxContainer: {
        display: "flex",
        flexDirection: "column",
        gap: vScale(16),
        marginTop: vScale(120),
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
    stickyNav: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    pdfPlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEF6A2",
    },
    pdfIcon: {
        width: scale(142),
        height: scale(142),
        borderRadius: scale(17),
        backgroundColor: "#23423B",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: vScale(7),
    },
    pdfIconText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(18),
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    previewFallbackText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(18),
        color: "#23423B",
        width: "80%",
        textAlign: "center"
    },
})

export default CreateRecordPage
