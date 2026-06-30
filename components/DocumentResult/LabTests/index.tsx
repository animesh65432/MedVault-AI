import { LabTest } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    tests: LabTest[];
};

const statusColor = (status?: string) => {
    if (!status) return { bg: "#F1EFE8", text: "#5F5E5A" };
    const s = status.toLowerCase();
    if (s.includes("high") || s.includes("low") || s.includes("abnormal")) {
        return { bg: "#FCEBEB", text: "#A32D2D" };
    }
    if (s.includes("normal")) {
        return { bg: "#EAF3DE", text: "#3B6D11" };
    }
    return { bg: "#F1EFE8", text: "#5F5E5A" };
};

const LabTests: React.FC<Props> = ({ tests }) => {
    if (tests.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>Test results</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{tests.length}</Text>
                </View>
            </View>

            <View style={styles.list}>
                {tests.map((test, index) => {
                    const colors = statusColor(test.status);
                    const hasValue = test.value || test.unit || test.normal_range;

                    return (
                        <View
                            key={`${test.name}-${index}`}
                            style={styles.row}
                        >
                            <View style={styles.rowLeft}>
                                <Text style={styles.testName} numberOfLines={2}>
                                    {test.name || "Unnamed test"}
                                </Text>
                                {!!test.normal_range && (
                                    <Text style={styles.range}>
                                        Normal: {test.normal_range}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.rowRight}>
                                {hasValue && (
                                    <Text style={styles.value}>
                                        {test.value}
                                        {test.unit ? ` ${test.unit}` : ""}
                                    </Text>
                                )}
                                {!!test.status && (
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: colors.bg },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {test.status}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(10),
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    countBadge: {
        backgroundColor: "#E5F0EB",
        borderRadius: scale(10),
        paddingHorizontal: scale(8),
        paddingVertical: scale(2),
    },
    countText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
    },
    list: {
        gap: scale(6),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FAFAF8",
        borderWidth: 1,
        borderColor: "#E5E4DD",
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        gap: scale(8),
    },
    rowLeft: {
        flex: 1,
        gap: scale(2),
    },
    testName: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    range: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Regular",
        color: "#888780",
    },
    rowRight: {
        alignItems: "flex-end",
        gap: scale(4),
    },
    value: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    statusBadge: {
        borderRadius: scale(10),
        paddingHorizontal: scale(7),
        paddingVertical: scale(2),
    },
    statusText: {
        fontSize: fs(10),
        fontFamily: "Aeonik-Medium",
    },
});

export default LabTests;