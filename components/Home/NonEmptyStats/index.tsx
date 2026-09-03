import { CountTypes } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from 'react'
import { StyleSheet, View } from "react-native"
import InputBox from "../InputBox"
import RecentDocuments from "../RecentDocuments"
import Stats from "../Stats"
import AskAi from "./AskAi"
import Header from "./Header"

const NonEmptyStats: React.FC<CountTypes> = ({ documentsCount, medicinesCount, remindersCount }) => {
    return (
        <View style={styles.container}>
            <Header />
            <Stats
                documentsCount={documentsCount}
                medicinesCount={medicinesCount}
                remindersCount={remindersCount}
            />
            <InputBox />
            <AskAi />
            <RecentDocuments />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: vScale(20),
        paddingHorizontal: scale(20),
        paddingTop: vScale(40),
        paddingBottom: vScale(32),
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

    },
})

export default NonEmptyStats 