import { DocumentType, Medicine } from "@/types";
import { scale } from "@/utils/scale";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Below from "./Below";
import DischargeSummary from "./DischargeSummary";
import Generic from "./Generic";
import LabReport from "./LabReport";
import MedicalBill from "./MedicalBill";
import Navbar from "./Navbar";
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
};

const DocumentResult: React.FC<Props> = ({ document, onReminderToggled }) => {
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
        switch (document.doc_type) {
            case "Prescription":
                return (
                    <Prescription
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Prescription Receipt":
                return (
                    <PrescriptionReceipt
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Lab Report":
                return <LabReport document={document} />;
            case "Radiology Report":
                return <RadiologyReport document={document} />;
            case "Medical Bill":
                return <MedicalBill document={document} />;
            case "Discharge Summary":
                return (
                    <DischargeSummary
                        document={document}
                        activeReminders={activeReminders}
                        onToggleReminder={handleToggleReminder}
                    />
                );
            case "Referral Letter":
                return (
                    <ReferralLetter
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
    }, [document, activeReminders, handleToggleReminder]);

    return <View style={{ flex: 1 }}>
        <Navbar />
        <ScrollView
            contentContainerStyle={{ paddingBottom: 60 }}
        >
            {content}
        </ScrollView>
        <Below />
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