import { DocumentType, Medicine } from "@/types";
import { scale } from "@/utils/scale";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
    fileName: string
};

const DocumentResult: React.FC<Props> = ({ fileUri, fileName, isPdf, document, onReminderToggled }) => {
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

    const content = useMemo(() => {
        switch (document.type) {
            case "Prescription":
                return (
                    <Prescription
                        isEditable={isEditable}
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Prescription Receipt":
                return (
                    <PrescriptionReceipt
                        isEditable={isEditable}
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Lab Report":
                return <LabReport
                    document={document}
                    isEditable={isEditable}
                />;
            case "Radiology Report":
                return <RadiologyReport
                    document={document}
                    isEditable={isEditable}
                />;
            case "Medical Bill":
                return <MedicalBill
                    document={document}
                    isEditable={isEditable}
                />;
            case "Discharge Summary":
                return (
                    <DischargeSummary
                        isEditable={isEditable}
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Referral Letter":
                return (
                    <ReferralLetter
                        isEditable={isEditable}
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Insurance Document":
            case "Consent Form":
            case "Medical History Record":
            case "Other":
                return (
                    <Generic
                        isEditable={isEditable}
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            default: {
                const _exhaustive: never = document;
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

    const handleOpenEdit = () => {
        setIsEditable(true);
    }

    const handleCloseEdit = () => {
        setIsEditable(false);
    }

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: scale(40),
        marginBottom: scale(50)
    }
})

export default DocumentResult;