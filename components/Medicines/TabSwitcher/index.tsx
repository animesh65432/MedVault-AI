import { MedicinesTab } from "@/types"
import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

interface TabSwitcherProps {
    activeTab: MedicinesTab
    onChange: (tab: MedicinesTab) => void
}

const TABS: { key: MedicinesTab; label: string }[] = [
    { key: "prescription", label: "By Prescription" },
    { key: "all", label: "All Medicines" },
]

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onChange }) => {
    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const isActive = tab.key === activeTab
                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onChange(tab.key)}
                        style={[styles.tab, isActive && styles.tabActive]}
                    >
                        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#F0F3F1",
        borderRadius: scale(14),
        padding: scale(4),
    },
    tab: {
        flex: 1,
        paddingVertical: vScale(10),
        borderRadius: scale(11),
        alignItems: "center",
        justifyContent: "center",
    },
    tabActive: {
        backgroundColor: "#1F3A2E",
    },
    tabText: {
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#6B8579",
    },
    tabTextActive: {
        color: "#FFFFFF",
    },
})

export default TabSwitcher