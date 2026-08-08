import { deleteReminder, GetAllReminders, GetRemindersCount, toggleAlarm } from "@/db/alerts";
import { useNotification } from "@/hooks/use-Notification";
import { ReminderRepeat, ReminderWithMedicine } from "@/types";
import { scale } from "@/utils/scale";
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from "react-native-toast-message";
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
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [IsLoading, setIsLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const { addAlarm, removeAlarm } = useNotification()
    const [step, setStep] = useState<Step>('list');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [Reminders, setReminders] = useState<ReminderWithMedicine[]>([]);
    const [AlertsCount, setAlertsCount] = useState(0);

    async function IntialLoad() {
        setIsLoading(true);
        try {
            const [Count, Data] = await Promise.all([
                GetRemindersCount(db),
                GetAllReminders(db, 0, 15)
            ]);
            setAlertsCount(Count);
            setReminders(Data);
            setOffset(Data.length);
            setHasMore(Data.length < Count);
        } catch (error) {
            console.log("Error loading reminders:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const loadMoreReminders = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const more = await GetAllReminders(db, offset, 15);
            setReminders(prev => [...prev, ...more]);
            setOffset(prev => prev + more.length);
            setHasMore(more.length === 15);
        } catch (error) {
            console.log("Error loading more reminders:", error);
        } finally {
            setLoadingMore(false);
        }
    };

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

    async function refreshCount() {
        const Count = await GetRemindersCount(db)
        setAlertsCount(Count)
    }

    const handleSaveReminder = async (reminderwithmedicine: ReminderWithMedicine) => {
        try {
            await addAlarm({
                ...reminderwithmedicine,
                time: new Date(reminderwithmedicine.time),
                repeat: reminderwithmedicine.repeat as ReminderRepeat,
                Id: reminderwithmedicine.Id,
            })

            setReminders(prev => [...prev, { ...reminderwithmedicine, IsEnabled: true }]);

            await refreshCount();
        }
        catch (error) {
            console.log("Error adding alarm:", error);
        }
        finally {
            setStep('list');
        }
    }

    const OntoggoleAlert = async (id: number, value: boolean) => {
        const reminder = Reminders.find(r => r.Id === id);
        if (!reminder) return;

        try {
            await toggleAlarm(db, id, value);

            setReminders(prev =>
                prev.map(r => (r.Id === id ? { ...r, IsEnabled: value } : r))
            );

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

    const handleDeleteReminder = async (id: number) => {
        try {
            setReminders(prev => prev.filter(r => r.Id !== id));
            await removeAlarm(String(id));
            await deleteReminder(db, id);
            await refreshCount();
        }
        catch (error) {
            console.log("Error deleting reminder:", error);
            Toast.show({
                type: "error",
                text1: "Failed to delete reminder."
            });
        }
    }

    return (
        <View style={styles.container}>
            <Navbar />
            {step === 'list' && <Title Count={AlertsCount} />}
            {step === 'list' &&
                <RemindersList
                    IsLoading={IsLoading}
                    Reminders={Reminders}
                    OntoggoleAlert={OntoggoleAlert}
                    onLoadMore={loadMoreReminders}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                    OnDeleteReminder={handleDeleteReminder}
                />
            }
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


