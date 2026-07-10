import UploadButtom from "@/components/UploadButtom"
import { CountTypes } from "@/types"
import { vScale } from "@/utils/vScale"
import React from 'react'
import { StyleSheet, View } from "react-native"
import InputBox from "../InputBox"
import RecentDocuments from "../RecentDocuments"
import Stats from "../Stats"

const NonEmptyStats: React.FC<CountTypes> = ({ documentsCount, medicinesCount, remindersCount }) => {
    return (
        <View style={styles.container}>
            <Stats
                documentsCount={documentsCount}
                medicinesCount={medicinesCount}
                remindersCount={remindersCount}
            />
            <InputBox />
            <UploadButtom />
            <RecentDocuments />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: vScale(20)
    }
})

export default NonEmptyStats 