import { GetAllReminders, GetRemindersCount } from "@/db/alerts";
import { ReminderWithMedicine } from "@/types";
import { scale } from "@/utils/scale";
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FAB from "./Fab";
import Medicines from "./Medicines";
import Navbar from './Navbar';
import RemindersList from "./RemindersList";
import Title from './Title';

const AlertsComponent: React.FC = () => {
    const db = useSQLiteContext();
    const [OnToggoleAddMedicine, SetOnToggoleAddMedicine] = useState(false);
    const [SelectedMedicineID, SetSelectedMedicineID] = useState<number | null>(null);
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
        SetOnToggoleAddMedicine(!OnToggoleAddMedicine);
    }

    return (
        <View style={styles.container}>
            <Navbar />
            <Title
                Count={AlertsCount}
            />
            {OnToggoleAddMedicine ?
                <Medicines /> : <RemindersList
                    Reminders={Reminders}
                />
            }

            <FAB
                onPress={handleFABPress}
            />

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