import { AlarmContext } from "@/context/Alarm";
import { AddReminderToMedicineReturningId, delete_document, RemoveReminderFromMedicine, update_document } from "@/db/document";
import { useNotification } from "@/hooks/use-Notification";
import { BillingItem, LabTest, Medicine, Reminder, UploadedDocument } from "@/types";
import { scale } from "@/utils/scale";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import ImageView from "react-native-image-viewing";
import Toast from "react-native-toast-message";
import ChatBotAI from "../ChatBotAI";
import Below from "../DocumentResult/Below";
import PDFViewer from "../DocumentResult/PDFViewer";
import DischargeSummary from "./DischargeSummaryDocument";
import Generic from "./Generic";
import LabReport from "./LabReport";
import MedicalBill from "./MedicalBill";
import Navbar from "./Navbar";
import Prescription from "./Prescription";
import PrescriptionReceipt from "./PrescriptionReceipt";
import RadiologyReport from "./RadiologyReport";
import ReferralLetter from "./ReferralLetterDocument";

type Props = {
    document: UploadedDocument;
    setDocument: React.Dispatch<React.SetStateAction<UploadedDocument | null>>;
}

const DocumentView: React.FC<Props> = ({ document, setDocument }) => {
    const { IsAlarmActive } = useContext(AlarmContext)
    const [ShowDocumentViewVisible, setShowDocmentViewVisible] = useState(false);
    const [IsDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState(false);
    const { addAlarm, removeAlarm } = useNotification();
    const db = useSQLiteContext();

    const onChangeTitle = (value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                title: value,
            };
        });
    };

    const onFieldValueChange = (label: string, value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [label]: value,

            } as UploadedDocument | null;
        });
    };

    const onRemoveNote = (index: number) => {
        if (!document.notes) return;
        setDocument(prev => {
            if (!prev || !prev.notes) return prev;
            return {
                ...prev,
                notes: prev.notes.filter((_, i) => i !== index)

            } as UploadedDocument | null;
        });
    };

    const onUpdateNote = (index: number, value: string) => {
        if (!document.notes) return;

        if (value.trim() === "") {
            onRemoveNote(index);
            return;
        }

        setDocument(prev => {
            if (!prev || !prev.notes) return prev;
            return {
                ...prev,
                notes: [
                    ...prev.notes.slice(0, index),
                    value,
                    ...prev.notes.slice(index + 1)
                ]

            } as UploadedDocument
        });
    };

    const onAddNote = (note: string) => {
        if (!document.notes) return;

        if (note.trim() === "") {
            Toast.show({
                type: "info",
                text1: "Note cannot be empty"
            })
            return;
        }

        setDocument(prev => {
            if (!prev || !prev.notes) return prev;
            return {
                ...prev,
                notes: [...prev.notes, note]

            } as UploadedDocument
        })
    };

    const onUpdateTag = (index: number, value: string) => {
        if (!document.tags) return;
        setDocument(prev => {
            if (!prev || !prev.tags) return prev;
            return {
                ...prev,
                tags: [
                    ...prev.tags.slice(0, index),
                    value,
                    ...prev.tags.slice(index + 1)
                ]

            } as UploadedDocument
        });
    };

    const onRemoveTag = (index: number) => {
        if (!document.tags) return;
        setDocument(prev => {
            if (!prev || !prev.tags) return prev;
            return {
                ...prev,
                tags: prev.tags.filter((_, i) => i !== index)
            } as UploadedDocument;
        })
    };

    const onAddTag = (value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                tags: [...(prev.tags ?? []), value]
            } as UploadedDocument | null;
        });
    };

    const handleOpenEdit = () => {
        setIsEditable(true);
    }

    const handleCloseEdit = async () => {
        setIsEditable(true);
        try {
            await update_document(db, document);
        }
        catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to save changes. Please try again."
            });
        }
        finally {
            setIsEditable(false);
        }
    }

    const handleDeleteDocument = async () => {
        setIsDeleteLoading(true);
        try {
            await delete_document(db, document.Id);
            router.back();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to delete document. Please try again."
            })
        }
        finally {
            setIsDeleteLoading(false);
        }
    }

    const onUpdateMedicine = (index: number, field: keyof Medicine, value: string) => {
        setDocument(prev => {
            if (!prev) return prev;

            if (!("medicines" in prev)) return prev;
            const medicines = prev.medicines;
            if (!medicines?.[index]) return prev;

            const updated = [...medicines];
            updated[index] = { ...updated[index], [field]: value };

            return {
                ...prev,
                medicines: updated,
            } as UploadedDocument;
        });
    };

    const onRemoveMedicine = (index: number) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev)) return prev;
            const medicines = prev.medicines;
            if (!medicines?.[index]) return prev;

            const updated = medicines.filter((_, i) => i !== index);

            return {
                ...prev,
                medicines: updated,
            } as UploadedDocument;
        });
    }

    const onAddMedicine = (medicine: Medicine) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev)) return prev;

            const medicines = prev.medicines ?? [];
            const updated = [...medicines, medicine];

            return {
                ...prev,
                medicines: updated,
            } as UploadedDocument;
        });
    };

    const onBillingUpdateItem = (index: number, field: keyof BillingItem, value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("billing_items" in prev)) return prev;
            const items = prev.billing_items;
            if (!items?.[index]) return prev;

            const updated = [...items];
            updated[index] = { ...updated[index], [field]: value };

            return {
                ...prev,
                billing_items: updated,
            } as UploadedDocument;
        });
    };

    const onBillingRemoveItem = (index: number) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("billing_items" in prev)) return prev;
            const items = prev.billing_items;
            if (!items?.[index]) return prev;

            const updated = items.filter((_, i) => i !== index);

            return {
                ...prev,
                billing_items: updated,

            } as UploadedDocument;
        });
    }

    const onBillingAddItem = (item: BillingItem) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("billing_items" in prev)) return prev;

            const items = prev.billing_items ?? [];
            const updated = [...items, item];

            return {
                ...prev,
                billing_items: updated,
            } as UploadedDocument;
        });
    }

    const onUpdateSubtotal = (value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("subtotal" in prev)) return prev;

            return {
                ...prev,
                subtotal: value,

            } as UploadedDocument;
        });
    }

    const onUpdateDiscount = (value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("discount" in prev)) return prev;

            return {
                ...prev,
                document_metadata: {
                    ...prev,
                    discount: value,
                },
            } as UploadedDocument;
        });
    }

    const onUpdateTotal = (value: string) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("total" in prev)) return prev;

            return {
                ...prev,
                total_amount: value,

            } as UploadedDocument;
        });
    }

    const onChangeTest = (index: number, patch: Partial<LabTest>) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("tests" in prev)) return prev;
            const tests = prev.tests;
            if (!tests?.[index]) return prev;

            const updated = [...tests];
            updated[index] = { ...updated[index], ...patch };

            return {
                ...prev,
                tests: updated,
            } as UploadedDocument;
        });
    }

    const onRemoveTest = (index: number) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("tests" in prev)) return prev;
            const tests = prev.tests;
            if (!tests?.[index]) return prev;

            const updated = tests.filter((_, i) => i !== index);

            return {
                ...prev,
                tests: updated,

            } as UploadedDocument;
        });
    }

    const onAddTest = (test: LabTest) => {
        setDocument(prev => {
            if (!prev) return prev;
            if (!("tests" in prev)) return prev;

            const tests = prev.tests ?? [];
            const updated = [...tests, test];

            return {
                ...prev,
                tests: updated,
            } as UploadedDocument;
        });
    }

    const onAddReminder = async (index: number, reminder: Reminder) => {

        if (!IsAlarmActive) {
            Toast.show({
                type: "info",
                text1: "Please enable notifications to set reminders."
            });
            return;
        }

        const medicine = document && "medicines" in document ? document.medicines?.[index] : undefined;

        if (!medicine) return;

        let savedReminder = reminder;

        let result;

        if (medicine.Id) {
            result = await AddReminderToMedicineReturningId(db, medicine.Id, reminder);
            savedReminder = { ...reminder, Id: result };
        }

        setDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev)) return prev;
            const medicines = prev.medicines;
            const medicine = medicines?.[index];
            if (!medicine) return prev;

            const reminders = medicine.reminders ?? [];
            const updated = [...reminders, savedReminder];

            const updatedMedicines = medicines.map((m, i) =>
                i === index ? { ...m, reminders: updated } : m
            );

            return { ...prev, medicines: updatedMedicines } as UploadedDocument;
        });

        await addAlarm({
            ...reminder, Id: result
        });
    };

    const onRemoveReminder = async (medicineIndex: number, reminderIndex: number) => {
        const medicine = document && "medicines" in document ? document.medicines?.[medicineIndex] : undefined;
        const reminder = medicine?.reminders?.[reminderIndex];
        if (!reminder) return;

        if (reminder.Id) {
            await RemoveReminderFromMedicine(db, reminder.Id);
        }

        setDocument(prev => {
            if (!prev) return prev;
            if (!("medicines" in prev)) return prev;
            const medicines = prev.medicines;
            const medicine = medicines?.[medicineIndex];
            if (!medicine) return prev;

            const reminders = medicine.reminders ?? [];
            const updatedReminders = reminders.filter((_, i) => i !== reminderIndex);

            const updatedMedicines = medicines.map((m, i) =>
                i === medicineIndex ? { ...m, reminders: updatedReminders } : m
            );

            return { ...prev, medicines: updatedMedicines } as UploadedDocument;
        });

        if (reminder.Id !== undefined) {
            await removeAlarm(reminder.Id.toString());
        }
    };

    const onChangeTextProseBlock = (type: "Generic" | "Radiology Report" | "Discharge Summary" | "Referral Letter", label: string, value: string) => {
        if (type === "Radiology Report") {
            setDocument(prev => {
                if (!prev) return prev;
                if (prev.type !== "Radiology Report") return prev;

                return {
                    ...prev,
                    [label]: value,

                } as UploadedDocument;
            });
        }
        else if (type === "Discharge Summary") {
            setDocument(prev => {
                if (!prev) return prev;
                if (prev.type !== "Discharge Summary") return prev;

                return {
                    ...prev,
                    document_metadata: {
                        ...prev,
                        [label]: value,
                    },
                } as UploadedDocument;
            });
        }
        else if (type === "Referral Letter") {
            setDocument(prev => {
                if (!prev) return prev;
                if (prev.type !== "Referral Letter") return prev;

                return {
                    ...prev,
                    document_metadata: {
                        ...prev,
                        [label]: value,
                    },
                } as UploadedDocument;
            })
        }
        else {
            setDocument(prev => {
                if (!prev) return prev;
                if (!("summary" in prev)) return prev;
                return { ...prev, [label]: value } as UploadedDocument;
            });
        }
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
                        onAddMedicine={onAddMedicine}
                        initialTitle={document.title}
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
                        document={document}
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
                        initialTitle={document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
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
                    onChangeTest={onChangeTest}
                    onRemoveTest={onRemoveTest}
                    onAddTest={onAddTest}
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
                    onChangeTextProseBlock={onChangeTextProseBlock}
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
                        document={document}
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
                        initialTitle={document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                        onChangeTextProseBlock={onChangeTextProseBlock}
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
                        onAddMedicine={onAddMedicine}
                        initialTitle={document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                        onChangeTextProseBlock={onChangeTextProseBlock}
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
                        onAddMedicine={onAddMedicine}
                        initialTitle={document.title}
                        onAddReminder={onAddReminder}
                        onRemoveReminder={onRemoveReminder}
                        onChangeTextProseBlock={onChangeTextProseBlock}
                    />
                );
            default: {
                return null;
            }
        }
    }, [document, isEditable,]);


    const handleViewOriginalPress = useCallback(() => {
        setShowDocmentViewVisible(true);
    }, []);

    const handleCloseDocumentView = useCallback(() => {
        setShowDocmentViewVisible(false);
    }, []);

    return (
        <View
            style={styles.container}
        >
            <Navbar
                title={document.type}
                IsDeleteLoading={IsDeleteLoading}
                onDelete={handleDeleteDocument}
            />
            <ScrollView
                contentContainerStyle={{ paddingBottom: scale(80) }}
            >
                {content}
            </ScrollView>
            <ChatBotAI
                currentDocument="true"
                documentId={document.Id}
            />
            <Below
                onViewOriginalPress={handleViewOriginalPress}
                onEditPress={handleOpenEdit}
                onEditClosePress={handleCloseEdit}
                isEditable={isEditable}
            />
            {!document.IsPdf &&
                <ImageView
                    images={[{ uri: document.SourceFilePath }]}
                    visible={ShowDocumentViewVisible}
                    onRequestClose={() => setShowDocmentViewVisible(false)}
                    imageIndex={0}
                />
            }
            {!!document.IsPdf &&
                <PDFViewer
                    visible={ShowDocumentViewVisible}
                    uri={document.SourceFilePath}
                    Onclose={handleCloseDocumentView}
                />
            }
        </View>
    )
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#fff",
    }
};

export default DocumentView