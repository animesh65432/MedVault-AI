import { MedicineDetail as MedicineDetailTypes } from "@/db/medicines"
import { fs } from "@/utils/fs"
import { scale } from "@/utils/scale"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {
    medicineDetail: MedicineDetailTypes
}

const Header: React.FC<Props> = ({ medicineDetail }) => {
    return (
        <View style={style.Container}>
            <Text style={style.title}>{medicineDetail.medicine.name}</Text>
            <View style={style.BelowContainer}>
                {medicineDetail.medicine.name &&
                    <View style={style.nameContainer}>
                        <Text style={style.name}>{medicineDetail.medicine.dosage}</Text>
                    </View>
                }
                {medicineDetail.medicine.frequency &&
                    <View style={style.nameContainer}>
                        <Text style={style.name}>{medicineDetail.medicine.frequency}</Text>
                    </View>
                }
                {medicineDetail.medicine.duration &&
                    <View style={style.nameContainer}>
                        <Text style={style.name}>{medicineDetail.medicine.duration}</Text>
                    </View>
                }
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    Container: {
        paddingHorizontal: scale(20),
        gap: scale(10),
    },
    title: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(22),
        color: "#234338"
    },
    BelowContainer: {
        flexDirection: "row",
        gap: scale(20)
    },
    nameContainer: {
        backgroundColor: "#0D483F",
        borderRadius: scale(16),
    },
    name: {
        color: "#D9F99D",
        fontFamily: "Aeonik-Medium",
        fontSize: fs(14),
        paddingHorizontal: scale(10),
        paddingVertical: scale(4)
    }
})

export default Header