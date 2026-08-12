import { onSnooze, onTakeNow } from "@/db/dosage"
import { useNotification } from "@/hooks/use-Notification"
import { AlertMedicineDetails } from "@/types"
import { vScale } from '@/utils/vScale'
import { useRouter } from "expo-router"
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Toast from "react-native-toast-message"
import Details from './Details'
import DosageCard from './DosageCard'
import Hero from './Hero'
import Navbar from './Navbar'


type Props = {
    medicineDetails: AlertMedicineDetails
}

const AlertDetailsComponent: React.FC<Props> = ({
    medicineDetails,
}) => {
    const db = useSQLiteContext();
    const router = useRouter();
    const { addAlarm } = useNotification();

    const handleSnooze = async () => {
        try {
            await onSnooze(db, medicineDetails.reminder);

            await addAlarm({
                Id: medicineDetails.reminder.Id!,
                title: medicineDetails.reminder.title,
                time: new Date(Date.now() + 10 * 60 * 1000),
                repeat: 'once',
            })

            Toast.show({
                type: "success",
                text1: "Snoozed",
                text2: "Medicine snoozed for 10 minutes"
            })

            router.back();
        } catch (error) {
            console.log("Failed to snooze medicine:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to snooze medicine"
            })
        }
    }

    const handleTakeNow = async () => {
        try {
            await onTakeNow(db, medicineDetails.reminder);
            Toast.show({
                type: "success",
                text1: "Taken",
                text2: "Medicine taken successfully"
            })
            router.back();
        } catch (error) {
            console.log("Failed to take medicine:", error);
        }
    }
    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <Hero medicineDetails={medicineDetails} />
                <DosageCard
                    reminder={medicineDetails.reminder}
                    MedicineName={medicineDetails.name}
                    onTakeNow={handleTakeNow}
                    onSnooze={handleSnooze}
                />
                <Details medicineDetails={medicineDetails} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        gap: vScale(28),
        paddingTop: vScale(40),
    },
})

export default AlertDetailsComponent