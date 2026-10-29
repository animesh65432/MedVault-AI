import { SelectedDocumentsContext } from '@/context/SelectedDocuments';
import { DeleteRecordById, GetRecordById, UpdateRecord } from '@/db/Record';
import { usePdfThumbnail } from '@/hooks/usePdfThumbnail';
import { DocumentRow, RecordDetails } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { fs } from '@/utils/fs';
import { getSelectedDocumentsDateRange } from '@/utils/getSelectedDocumentsDateRange';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import DocumentsComponent from './Documents';
import Navbar from './Navbar';
import SelectionModeNavbar from "./SelectionModeNavbar";

type Props = {
    record: RecordDetails;
    Documents: DocumentRow[];
    id: number;
}

const PageSize = 9;

const RecordDetailsPage: React.FC<Props> = ({ id, record, Documents: DefaultDocuments }) => {
    const { height } = Dimensions.get('window');
    const { setSelectedDocumentsIds, SelectedDocumentsIds } = useContext(SelectedDocumentsContext);
    const db = useSQLiteContext();
    const [IsDeleting, setIsDeleting] = useState<boolean>(false);
    const [IsUpdating, setIsUpdating] = useState<boolean>(false);
    const [Documents, setDocuments] = useState<DocumentRow[]>([]);
    const pageRef = useRef<number>(1);
    const IsLoadingMoreRef = useRef<boolean>(false);
    const [SelectedIds, setSelectedIds] = useState<number[]>([]);
    const router = useRouter();
    const [Title, setTitle] = useState<string>(record.Name || '');
    const hasImage = Documents.length > 0 && !Documents[0].IsPdf;
    const hasPdf = Documents.length > 0 && !!Documents[0].IsPdf;
    const { thumbUri, thumbFailed } = usePdfThumbnail(Documents[0]?.SourceFilePath ?? '', Documents[0]?.IsPdf);
    const dateRange = getSelectedDocumentsDateRange(Documents);
    const heroHeight = height * 0.8;
    const textColor = hasImage ? "#fff" : "#23423B";
    const SelectionMode = SelectedIds.length > 0;

    const removeSelectedDocuments = () => {
        if (SelectedIds.length === 0) return;
        const remainingDocuments = Documents.filter(doc => !SelectedIds.includes(doc.Id));
        setDocuments(remainingDocuments);
        setSelectedIds([]);
    }

    useFocusEffect(
        useCallback(() => {
            if (DefaultDocuments.length > 0) {
                setDocuments(DefaultDocuments);
            }
            return () => {
                setDocuments([]);
                setSelectedDocumentsIds([]);
            };
        }, [id])
    );

    const ShowdefultPdf = thumbFailed && hasPdf;

    const LoadMoreDocuments = async () => {
        if (IsLoadingMoreRef.current) {
            return;
        }

        IsLoadingMoreRef.current = true;

        try {
            const offset = pageRef.current * PageSize;

            const { documents } = await GetRecordById(
                db,
                id,
                PageSize,
                offset
            );

            if (documents.length === 0) {
                return;
            }

            setDocuments(previous => {
                const existingIds = new Set(
                    previous.map(doc => doc.Id)
                );

                const uniqueDocuments = documents.filter(
                    doc => !existingIds.has(doc.Id)
                );

                return [...previous, ...uniqueDocuments];
            });

            pageRef.current += 1;

            if (documents.length < PageSize) {
            }
        } catch (error) {
            console.error("Failed to load more documents:", error);
        } finally {
            IsLoadingMoreRef.current = false;
        }
    };

    const handleDeleteRecord = async () => {
        setIsDeleting(true);
        try {
            await DeleteRecordById(db, id);
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Record deleted successfully.",
            });
            router.push("/Documents")
        } catch (error) {
            console.log("Failed to delete the record:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete the record. Please try again.",
            });
        }
        finally {
            setIsDeleting(false);
        }

    }

    const handleUpdateRecord = async () => {
        setIsUpdating(true);
        try {
            if (Title.trim().length === 0 || Documents.length === 0) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Title and documents cannot be empty.",
                });
                return;
            }

            await UpdateRecord(db, id, Title, Documents.map(doc => doc.Id));

            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Record updated successfully.",
            });

        } catch (error) {
            console.log("Failed to update the record:", error);
        }
        finally {
            setIsUpdating(false);
        }
    }

    console.log("RecordDetails  Documents Ids", SelectedDocumentsIds.length);

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
                    <Navbar
                        handleUpdateRecord={handleUpdateRecord}
                        handleDeleteRecord={handleDeleteRecord}
                        IsDeleting={IsDeleting}
                    />
                }
            </View>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ gap: vScale(20) }}
                onScroll={LoadMoreDocuments}
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
                            value={Title}
                            style={[styles.titleContainer, { color: textColor }]}
                            placeholder="Add a title"
                            placeholderTextColor={hasImage ? "rgba(255,255,255,0.7)" : "#23423B"}
                            autoFocus
                            onChangeText={setTitle}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.Select_PhotosContainer}
                        onPress={() => router.push({
                            pathname: "/AddDocuments",
                            params: {
                                title: Title,
                                recordId: id.toString(),
                            }
                        })}
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
                <DocumentsComponent
                    documents={Documents}
                    SelectedIds={SelectedIds}
                    setSelectedIds={setSelectedIds}
                    SelectionMode={SelectionMode}
                />
            </ScrollView>
        </View>
    )
}
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
        fontSize: scale(22),
        color: "#23423B",
        width: "80%",
        justifyContent: "center",
        textAlign: "center",
        marginTop: vScale(10)
    },
})


export default RecordDetailsPage