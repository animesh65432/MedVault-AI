import { deleteReminder, toggleAlarm } from "@/db/alerts";
import { MedicineDetail as MedicineDetailTypes } from "@/db/medicines";
import { useNotification } from "@/hooks/use-Notification";
import { ReminderRepeat } from "@/types";
import { scale } from "@/utils/scale";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ImageView from "react-native-image-viewing";
import Toast from "react-native-toast-message";
import Navbar from "../AlertDetailsComponent/Navbar";
import PDFViewer from "../DocumentResult/PDFViewer";
import Dose from "./Dose";
import Header from "./Header";
import Reminders from "./Reminders";
import Source from "./Source";
import Timing from "./Timing";


type Props = {
    medicineDetail: MedicineDetailTypes;
    setMedicineDetail: React.Dispatch<React.SetStateAction<MedicineDetailTypes | null>>;
}

const MedicineDetail: React.FC<Props> = ({ medicineDetail, setMedicineDetail }) => {
    const db = useSQLiteContext();
    const { addAlarm, removeAlarm } = useNotification()
    const [ShowDocumentViewVisible, setShowDocmentViewVisible] = useState(false);

    const handleViewOriginalPress = () => {
        setShowDocmentViewVisible(true);
    }

    const handleCloseDocumentView = () => {
        setShowDocmentViewVisible(false);
    };

    const handleDeleteReminder = async (id: number) => {
        try {
            await deleteReminder(db, id)

            setMedicineDetail((prev) => {
                if (!prev) return prev
                const updatedReminders = prev.reminders.filter(reminder => reminder.Id !== id)
                return {
                    ...prev,
                    reminders: updatedReminders
                }
            })
            Toast.show({
                type: 'success',
                text1: 'Reminder deleted successfully',
            })
        } catch (error) {
            console.error("Error deleting reminder:", error)
        }
    }

    const Ontoggole = async (id: number, value: boolean) => {
        const reminder = medicineDetail.reminders.find(r => r.Id === id);
        if (!reminder) return;
        try {
            await toggleAlarm(db, id, value);
            setMedicineDetail(prev => {
                if (!prev) return prev;
                const updatedReminders = prev.reminders.map(r =>
                    r.Id === id ? { ...r, IsEnabled: value ? 1 : 0 } : r
                );
                return {
                    ...prev,
                    reminders: updatedReminders
                };
            });

            if (value) {
                await addAlarm({
                    ...reminder,
                    time: new Date(reminder.time),
                    repeat: reminder.repeat as ReminderRepeat,
                    Id: id,
                });
            } else {
                await removeAlarm(String(id));
            }
        } catch (error) {
            console.log("Error toggling alarm:", error);
            Toast.show({
                type: "error",
                text1: "Failed to update reminder."
            });
        }
    }
    return (
        <View style={style.Container}>
            <Navbar />

            <ScrollView
                style={style.scroll}
                contentContainerStyle={style.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    medicineDetail={medicineDetail}
                />
                <Source
                    date={medicineDetail.document?.date!}
                    title={medicineDetail.document?.title!}
                    IsPdf={medicineDetail.document?.IsPdf!}
                    SourceFilePath={medicineDetail.document?.SourceFilePath!}
                    handleViewOriginalPress={handleViewOriginalPress}
                />
                <Timing
                    timing={medicineDetail.timing}
                />
                <Reminders
                    reminders={medicineDetail.reminders}
                    medicineName={medicineDetail.medicine.name}
                    dosage={medicineDetail.medicine.dosage}
                    handleDeleteReminder={handleDeleteReminder}
                    onToggle={Ontoggole}
                />
                <Dose
                    doseLog={medicineDetail.doseLogs}
                />
            </ScrollView>

            {medicineDetail.document && !medicineDetail.document.IsPdf &&
                <ImageView
                    images={[{ uri: medicineDetail.document.SourceFilePath }]}
                    visible={ShowDocumentViewVisible}
                    onRequestClose={() => setShowDocmentViewVisible(false)}
                    imageIndex={0}
                />
            }
            {medicineDetail.document && !!medicineDetail.document.IsPdf &&
                <PDFViewer
                    visible={ShowDocumentViewVisible}
                    uri={medicineDetail.document.SourceFilePath}
                    Onclose={handleCloseDocumentView}
                />
            }
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    scroll: {
        flex: 1,
        marginTop: scale(10),
    },
    scrollContent: {
        gap: scale(20),
        paddingBottom: scale(40),
    }
})

export default MedicineDetail