import { DocumentType, Medicine } from "@/types";
import { scale } from "@/utils/scale";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import ImageView from "react-native-image-viewing";
import Below from "./Below";
import DischargeSummary from "./DischargeSummary";
import Generic from "./Generic";
import LabReport from "./LabReport";
import MedicalBill from "./MedicalBill";
import Navbar from "./Navbar";
import PDFViewer from "./PDFViewer";
import Prescription from "./Prescription";
import PrescriptionReceipt from "./PrescriptionReceipt";
import RadiologyReport from "./RadiologyReport";
import ReferralLetter from "./ReferralLetter";

type Props = {
    document: DocumentType;
    onReminderToggled?: (
        index: number,
        medicine: Medicine,
        isNowActive: boolean
    ) => void;
    isPdf: boolean,
    fileUri: string
    fileName: string,
    Document: DocumentType
    SetDocument: React.Dispatch<React.SetStateAction<DocumentType>>
};

const DocumentResult: React.FC<Props> = ({ SetDocument, Document, fileUri, isPdf, document, onReminderToggled }) => {
    const [ShowDocumentViewVisible, setShowDocmentViewVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [activeReminders, setActiveReminders] = useState<Set<number>>(
        () => new Set()
    );

    const handleToggleReminder = useCallback(
        (index: number, medicine: Medicine) => {
            setActiveReminders((prev) => {
                const next = new Set(prev);
                const willBeActive = !next.has(index);
                if (willBeActive) {
                    next.add(index);
                } else {
                    next.delete(index);
                }
                onReminderToggled?.(index, medicine, willBeActive);
                return next;
            });
        },
        [onReminderToggled]
    );

    const onChangeTitle = (value: string) => {
        SetDocument(prev => {
            return {
                ...prev,
                title: value,
            };
        });
    };

    const onFieldValueChange = (label: string, value: string) => {
        SetDocument(prev => {
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    [label]: value,
                }
            } as DocumentType;
        });
    };
    const onRemoveNote = (index: number) => {
        if (!Document.document_metadata.important_notes) return;
        SetDocument(prev => ({
            ...prev,
            document_metadata: {
                ...prev.document_metadata,
                important_notes: prev.document_metadata.important_notes.filter((_, i) => i !== index)
            }
        } as typeof prev));
    };

    const onUpdateNote = (index: number, value: string) => {
        if (!Document.document_metadata.important_notes) return;

        if (value.trim() === "") {
            onRemoveNote(index);
            return;
        }

        SetDocument(prev => ({
            ...prev,
            document_metadata: {
                ...prev.document_metadata,
                important_notes: [
                    ...prev.document_metadata.important_notes.slice(0, index),
                    value,
                    ...prev.document_metadata.important_notes.slice(index + 1)
                ]
            }
        } as typeof prev));
    };

    const onAddNote = () => {
    };

    const onUpdateTag = (index: number, value: string) => {
        if (!Document.document_metadata.tags) return;
        SetDocument(prev => ({
            ...prev,
            document_metadata: {
                ...prev.document_metadata,
                tags: [
                    ...prev.document_metadata.tags.slice(0, index),
                    value,
                    ...prev.document_metadata.tags.slice(index + 1)
                ]
            }
        } as typeof prev));
    };

    const onRemoveTag = (index: number) => {
        if (!Document.document_metadata.tags) return;
        SetDocument(prev => ({
            ...prev,
            document_metadata: {
                ...prev.document_metadata,
                tags: prev.document_metadata.tags.filter((_, i) => i !== index)
            }
        } as typeof prev));
    };

    const onAddTag = (value: string) => {
        SetDocument(prev => ({
            ...prev,
            document_metadata: {
                ...prev.document_metadata,
                tags: [...(prev.document_metadata.tags ?? []), value]
            }
        } as typeof prev));
    };

    const handleOpenEdit = () => {
        setIsEditable(true);
    }

    const handleCloseEdit = () => {
        setIsEditable(false);
    }

    const onUpdateMedicine = (index: number, field: keyof Medicine, value: string) => {
        SetDocument(prev => {
            if (!("medicines" in prev.document_metadata)) return prev;
            const medicines = prev.document_metadata.medicines;
            if (!medicines?.[index]) return prev;

            const updated = [...medicines];
            updated[index] = { ...updated[index], [field]: value };

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    medicines: updated,
                },
            } as DocumentType;
        });
    };

    const onRemoveMedicine = (index: number) => {
        SetDocument(prev => {
            if (!("medicines" in prev.document_metadata)) return prev;
            const medicines = prev.document_metadata.medicines;
            if (!medicines?.[index]) return prev;

            const updated = medicines.filter((_, i) => i !== index);

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    medicines: updated,
                },
            } as DocumentType;
        });
    }

    const content = useMemo(() => {
        switch (document.type) {
            case "Prescription":
                return (
                    <Prescription
                        onChangeTitle={onChangeTitle}
                        onFieldValueChange={onFieldValueChange}
                        isEditable={isEditable}
                        document={document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onUpdateMedicine={onUpdateMedicine}
                        onRemoveMedicine={onRemoveMedicine}
                    />
                );
            case "Prescription Receipt":
                return (
                    <PrescriptionReceipt
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onUpdateMedicine={onUpdateMedicine}
                        onRemoveMedicine={onRemoveMedicine}
                    />
                );
            case "Lab Report":
                return <LabReport
                    onFieldValueChange={onFieldValueChange}
                    onChangeTitle={onChangeTitle}
                    document={document}
                    isEditable={isEditable}
                    onUpdateNote={onUpdateNote}
                    onRemoveNote={onRemoveNote}
                    onUpdateTag={onUpdateTag}
                    onRemoveTag={onRemoveTag}
                    onAddTag={onAddTag}
                    onAddNote={onAddNote}
                />;
            case "Radiology Report":
                return <RadiologyReport
                    onFieldValueChange={onFieldValueChange}
                    document={document}
                    isEditable={isEditable}
                    onChangeTitle={onChangeTitle}
                    onUpdateNote={onUpdateNote}
                    onRemoveNote={onRemoveNote}
                    onUpdateTag={onUpdateTag}
                    onRemoveTag={onRemoveTag}
                    onAddTag={onAddTag}
                    onAddNote={onAddNote}
                />;
            case "Medical Bill":
                return <MedicalBill
                    onFieldValueChange={onFieldValueChange}
                    document={document}
                    isEditable={isEditable}
                    onChangeTitle={onChangeTitle}
                    onUpdateNote={onUpdateNote}
                    onRemoveNote={onRemoveNote}
                    onUpdateTag={onUpdateTag}
                    onRemoveTag={onRemoveTag}
                    onAddTag={onAddTag}
                    onAddNote={onAddNote}
                />;
            case "Discharge Summary":
                return (
                    <DischargeSummary
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onRemoveMedicine={onRemoveMedicine}
                        onUpdateMedicine={onUpdateMedicine}
                    />
                );
            case "Referral Letter":
                return (
                    <ReferralLetter
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onRemoveMedicine={onRemoveMedicine}
                        onUpdateMedicine={onUpdateMedicine}
                    />
                );
            case "Insurance Document":
            case "Consent Form":
            case "Medical History Record":
            case "Other":
                return (
                    <Generic
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onRemoveMedicine={onRemoveMedicine}
                        onUpdateMedicine={onUpdateMedicine}
                    />
                );
            default: {
                return null;
            }
        }
    }, [document, activeReminders, handleToggleReminder, isEditable]);

    const handleViewOriginalPress = useCallback(() => {
        setShowDocmentViewVisible(true);
    }, []);

    const handleCloseDocumentView = useCallback(() => {
        setShowDocmentViewVisible(false);
    }, []);


    return <View style={{ flex: 1 }}>
        <Navbar />
        <ScrollView
            contentContainerStyle={{ paddingBottom: scale(80) }}
        >
            {content}
        </ScrollView>
        <Below
            onViewOriginalPress={handleViewOriginalPress}
            onEditPress={handleOpenEdit}
            onEditClosePress={handleCloseEdit}
            isEditable={isEditable}
        />
        {!isPdf &&
            <ImageView
                images={[{
                    uri: fileUri,
                }]}
                visible={ShowDocumentViewVisible}
                onRequestClose={() => setShowDocmentViewVisible(false)}
                imageIndex={0}
            />
        }
        {isPdf &&
            <PDFViewer
                visible={ShowDocumentViewVisible}
                uri={fileUri}
                Onclose={handleCloseDocumentView}
            />
        }
    </View>
};


export default DocumentResult;