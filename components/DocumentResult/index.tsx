import { BillingItem, DocumentType, LabTest, Medicine, Reminder } from "@/types";
import { scale } from "@/utils/scale";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import ImageView from "react-native-image-viewing";
import Toast from "react-native-toast-message";
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
    isPdf: boolean,
    fileUri: string
    fileName: string,
    Document: DocumentType
    SetDocument: React.Dispatch<React.SetStateAction<DocumentType | null>>
};

const DocumentResult: React.FC<Props> = ({ SetDocument, Document, fileUri, isPdf }) => {
    const [ShowDocumentViewVisible, setShowDocmentViewVisible] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const onChangeTitle = (value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                title: value,
            };
        });
    };

    const onFieldValueChange = (label: string, value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    [label]: value,
                }
            } as DocumentType | null;
        });
    };

    const onRemoveNote = (index: number) => {
        if (!Document.document_metadata.important_notes) return;
        SetDocument(prev => {
            if (!prev || !prev.document_metadata.important_notes) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    important_notes: prev.document_metadata.important_notes.filter((_, i) => i !== index)
                }
            } as DocumentType | null;
        });
    };

    const onUpdateNote = (index: number, value: string) => {
        if (!Document.document_metadata.important_notes) return;

        if (value.trim() === "") {
            onRemoveNote(index);
            return;
        }

        SetDocument(prev => {
            if (!prev || !prev.document_metadata.important_notes) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    important_notes: [
                        ...prev.document_metadata.important_notes.slice(0, index),
                        value,
                        ...prev.document_metadata.important_notes.slice(index + 1)
                    ]
                }
            } as DocumentType
        });
    };

    const onAddNote = (note: string) => {
        if (!Document.document_metadata.important_notes) return;

        if (note.trim() === "") {
            Toast.show({
                type: "info",
                text1: "Note cannot be empty"
            })
            return;
        }

        SetDocument(prev => {
            if (!prev || !prev.document_metadata.important_notes) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    important_notes: [...prev.document_metadata.important_notes, note]
                }
            } as DocumentType
        })
    };

    const onUpdateTag = (index: number, value: string) => {
        if (!Document.document_metadata.tags) return;
        SetDocument(prev => {
            if (!prev || !prev.document_metadata.tags) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    tags: [
                        ...prev.document_metadata.tags.slice(0, index),
                        value,
                        ...prev.document_metadata.tags.slice(index + 1)
                    ]
                }
            } as DocumentType
        });
    };

    const onRemoveTag = (index: number) => {
        if (!Document.document_metadata.tags) return;
        SetDocument(prev => {
            if (!prev || !prev.document_metadata.tags) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    tags: prev.document_metadata.tags.filter((_, i) => i !== index)
                }
            } as DocumentType;
        })
    };

    const onAddTag = (value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    tags: [...(prev.document_metadata.tags ?? []), value]
                }
            } as DocumentType | null;
        });
    };

    const handleOpenEdit = () => {
        setIsEditable(true);
    }

    const handleCloseEdit = () => {
        setIsEditable(false);
    }

    const onUpdateMedicine = (index: number, field: keyof Medicine, value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;

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
            if (!prev) return prev;
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

    const onAddMedicine = (medicine: Medicine) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev.document_metadata)) return prev;

            const medicines = prev.document_metadata.medicines ?? [];
            const updated = [...medicines, medicine];

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    medicines: updated,
                },
            } as DocumentType;
        });
    };

    const onBillingUpdateItem = (index: number, field: keyof BillingItem, value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("billing_items" in prev.document_metadata)) return prev;
            const items = prev.document_metadata.billing_items;
            if (!items?.[index]) return prev;

            const updated = [...items];
            updated[index] = { ...updated[index], [field]: value };

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    billing_items: updated,
                },
            } as DocumentType;
        });
    };

    const onBillingRemoveItem = (index: number) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("billing_items" in prev.document_metadata)) return prev;
            const items = prev.document_metadata.billing_items;
            if (!items?.[index]) return prev;

            const updated = items.filter((_, i) => i !== index);

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    billing_items: updated,
                },
            } as DocumentType;
        });
    }

    const onBillingAddItem = (item: BillingItem) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("billing_items" in prev.document_metadata)) return prev;

            const items = prev.document_metadata.billing_items ?? [];
            const updated = [...items, item];

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    billing_items: updated,
                },
            } as DocumentType;
        });
    }

    const onUpdateSubtotal = (value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("subtotal" in prev.document_metadata)) return prev;

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    subtotal: value,
                },
            } as DocumentType;
        });
    }

    const onUpdateDiscount = (value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("discount" in prev.document_metadata)) return prev;

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    discount: value,
                },
            } as DocumentType;
        });
    }

    const onUpdateTotal = (value: string) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("total" in prev.document_metadata)) return prev;

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    total_amount: value,
                },
            } as DocumentType;
        });
    }

    const onChangeTest = (index: number, patch: Partial<LabTest>) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("tests" in prev.document_metadata)) return prev;
            const tests = prev.document_metadata.tests;
            if (!tests?.[index]) return prev;

            const updated = [...tests];
            updated[index] = { ...updated[index], ...patch };

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    tests: updated,
                },
            } as DocumentType;
        });
    }

    const onRemoveTest = (index: number) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("tests" in prev.document_metadata)) return prev;
            const tests = prev.document_metadata.tests;
            if (!tests?.[index]) return prev;

            const updated = tests.filter((_, i) => i !== index);

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    tests: updated,
                },
            } as DocumentType;
        });
    }

    const onAddTest = (test: LabTest) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("tests" in prev.document_metadata)) return prev;

            const tests = prev.document_metadata.tests ?? [];
            const updated = [...tests, test];

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    tests: updated,
                },
            } as DocumentType;
        });
    }

    const onAddReminder = (index: number, reminder: Reminder) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev.document_metadata)) return prev;
            const medicines = prev.document_metadata.medicines;
            const medicine = medicines?.[index];
            if (!medicine) return prev;

            const reminders = medicine.reminders ?? [];
            const updated = [...reminders, reminder];

            const updatedMedicines = medicines.map((m, i) =>
                i === index ? { ...m, reminders: updated } : m
            );

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    medicines: updatedMedicines,
                },
            } as DocumentType;
        });
    }

    const onRemoveReminder = (medicineIndex: number, reminderIndex: number) => {
        SetDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev.document_metadata)) return prev;
            const medicines = prev.document_metadata.medicines;
            const medicine = medicines?.[medicineIndex];
            if (!medicine) return prev;

            const reminders = medicine.reminders ?? [];
            const updatedReminders = reminders.filter((_, i) => i !== reminderIndex);

            const updatedMedicines = medicines.map((m, i) =>
                i === medicineIndex ? { ...m, reminders: updatedReminders } : m
            );

            return {
                ...prev,
                document_metadata: {
                    ...prev.document_metadata,
                    medicines: updatedMedicines,
                },
            } as DocumentType;
        });
    }

    const content = useMemo(() => {
        switch (Document.type) {
            case "Prescription":
                return (
                    <Prescription
                        onChangeTitle={onChangeTitle}
                        onFieldValueChange={onFieldValueChange}
                        isEditable={isEditable}
                        document={Document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onUpdateMedicine={onUpdateMedicine}
                        onRemoveMedicine={onRemoveMedicine}
                        onAddMedicine={onAddMedicine}
                        initialTitle={Document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                    />
                );
            case "Prescription Receipt":
                return (
                    <PrescriptionReceipt
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={Document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onUpdateMedicine={onUpdateMedicine}
                        onRemoveMedicine={onRemoveMedicine}
                        onAddMedicine={onAddMedicine}
                        onUpdateItem={onBillingUpdateItem}
                        onRemoveItem={onBillingRemoveItem}
                        onAddItem={onBillingAddItem}
                        onUpdateSubtotal={onUpdateSubtotal}
                        onUpdateDiscount={onUpdateDiscount}
                        onUpdateTotal={onUpdateTotal}
                        initialTitle={Document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                    />
                );
            case "Lab Report":
                return <LabReport
                    onFieldValueChange={onFieldValueChange}
                    onChangeTitle={onChangeTitle}
                    document={Document}
                    isEditable={isEditable}
                    onUpdateNote={onUpdateNote}
                    onRemoveNote={onRemoveNote}
                    onUpdateTag={onUpdateTag}
                    onRemoveTag={onRemoveTag}
                    onAddTag={onAddTag}
                    onAddNote={onAddNote}
                    onChangeTest={onChangeTest}
                    onRemoveTest={onRemoveTest}
                    onAddTest={onAddTest}
                />;
            case "Radiology Report":
                return <RadiologyReport
                    onFieldValueChange={onFieldValueChange}
                    document={Document}
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
                    document={Document}
                    isEditable={isEditable}
                    onChangeTitle={onChangeTitle}
                    onUpdateNote={onUpdateNote}
                    onRemoveNote={onRemoveNote}
                    onUpdateTag={onUpdateTag}
                    onRemoveTag={onRemoveTag}
                    onAddTag={onAddTag}
                    onAddNote={onAddNote}
                    onUpdateItem={onBillingUpdateItem}
                    onRemoveItem={onBillingRemoveItem}
                    onAddItem={onBillingAddItem}
                    onUpdateSubtotal={onUpdateSubtotal}
                    onUpdateDiscount={onUpdateDiscount}
                    onUpdateTotal={onUpdateTotal}
                />;
            case "Discharge Summary":
                return (
                    <DischargeSummary
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={Document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onRemoveMedicine={onRemoveMedicine}
                        onUpdateMedicine={onUpdateMedicine}
                        onAddMedicine={onAddMedicine}
                        onChangeTest={onChangeTest}
                        onRemoveTest={onRemoveTest}
                        onAddTest={onAddTest}
                        initialTitle={Document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                    />
                );
            case "Referral Letter":
                return (
                    <ReferralLetter
                        onFieldValueChange={onFieldValueChange}
                        onChangeTitle={onChangeTitle}
                        isEditable={isEditable}
                        document={Document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onRemoveMedicine={onRemoveMedicine}
                        onUpdateMedicine={onUpdateMedicine}
                        onAddMedicine={onAddMedicine}
                        initialTitle={Document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
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
                        document={Document}
                        onUpdateNote={onUpdateNote}
                        onRemoveNote={onRemoveNote}
                        onUpdateTag={onUpdateTag}
                        onRemoveTag={onRemoveTag}
                        onAddTag={onAddTag}
                        onAddNote={onAddNote}
                        onRemoveMedicine={onRemoveMedicine}
                        onUpdateMedicine={onUpdateMedicine}
                        onAddMedicine={onAddMedicine}
                        initialTitle={Document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                    />
                );
            default: {
                return null;
            }
        }
    }, [Document, isEditable]);

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