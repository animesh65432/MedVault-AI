import { MedicineDetail as MedicineDetailTypes } from "@/db/medicines"
import { scale } from "@/utils/scale"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Navbar from "../AlertDetailsComponent/Navbar"
import Dose from "./Dose"
import Header from "./Header"
import Reminders from "./Reminders"
import Source from "./Source"
import Timing from "./Timing"


type Props = {
    medicineDetail: MedicineDetailTypes
}

const MedicineDetail: React.FC<Props> = ({ medicineDetail }) => {
    return (
        <View style={style.Container}>
            <Navbar />
            <Header
                medicineDetail={medicineDetail}
            />
            <Source />
            <Timing
                timing={medicineDetail.timing}
            />
            <Reminders
                reminders={medicineDetail.reminders}
            />
            <Dose
                doseLog={medicineDetail.doseLogs}
            />
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: scale(20),
    }
})

export default MedicineDetail