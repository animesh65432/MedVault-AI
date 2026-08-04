import { GetAllReminders, GetRemindersCount } from "@/db/alerts";
import { ReminderWithMedicine } from "@/types";
import { scale } from "@/utils/scale";
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AddReminder from "./AddReminder";
import FAB from "./Fab";
import Medicines from "./Medicines";
import { Medicine } from "./Medicines/Medicine";
import Navbar from './Navbar';
import RemindersList from "./RemindersList";
import Title from './Title';

type Step = 'list' | 'pickMedicine' | 'setReminder';

const AlertsComponent: React.FC = () => {
    const db = useSQLiteContext();
    const [step, setStep] = useState<Step>('list');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [Reminders, setReminders] = useState<ReminderWithMedicine[]>([]);
    const [AlertsCount, setAlertsCount] = useState(0);

    async function IntialLoad() {
        try {
            const [Count, Data] = await Promise.all([GetRemindersCount(db), GetAllReminders(db)]);
            setAlertsCount(Count);
            setReminders(Data);
        } catch (error) {
            console.log("Error loading reminders:", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            IntialLoad();
            return () => {
                IntialLoad();
            };
        }, [])
    );

    const handleFABPress = () => {
        setStep('pickMedicine');
        setSelectedMedicine(null);
    };

    const handleMedicineConfirm = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setStep('setReminder');
    };

    const handleSaveReminder = (reminderwithmedicine: ReminderWithMedicine) => {
        setStep('list');
    }

    console.log("Reminders:", Reminders);

    return (
        <View style={styles.container}>
            <Navbar />
            {step === 'list' && <Title Count={AlertsCount} />}
            {step === 'list' && <RemindersList Reminders={Reminders} />}
            {step === 'pickMedicine' && (
                <Medicines
                    onBack={() => setStep('list')}
                    onConfirm={handleMedicineConfirm}
                />
            )}
            {step === 'setReminder' && selectedMedicine && (
                <AddReminder
                    medicine={selectedMedicine}
                    onBack={() => setStep('pickMedicine')}
                    onSaved={handleSaveReminder}
                />
            )}
            {step === 'list' &&
                <FAB
                    onPress={handleFABPress}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: scale(10)
    }
})

export default AlertsComponent