import { BillingItem } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    items: BillingItem[];
    subtotal?: string;
    discount?: string;
    total?: string;
};

const Billing: React.FC<Props> = ({ items, subtotal, discount, total }) => {
    if (items.length === 0 && !total) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Billing</Text>

            {items.length > 0 && (
                <View style={styles.list}>
                    {items.map((item, index) => (
                        <View key={`${item.name}-${index}`} style={styles.row}>
                            <Text style={styles.itemName} numberOfLines={2}>
                                {item.name || "Item"}
                            </Text>
                            <Text style={styles.itemPrice}>{item.price}</Text>
                        </View>
                    ))}
                </View>
            )}

            {(subtotal || discount || total) && (
                <View style={styles.summary}>
                    {!!subtotal && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>{subtotal}</Text>
                        </View>
                    )}
                    {!!discount && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Discount</Text>
                            <Text style={[styles.summaryValue, styles.discountValue]}>
                                -{discount}
                            </Text>
                        </View>
                    )}
                    {!!total && (
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{total}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: scale(10),
    },
    title: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "#5F5E5A",
    },
    list: {
        gap: scale(6),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: scale(8),
    },
    itemName: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        flex: 1,
    },
    itemPrice: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    summary: {
        borderTopWidth: 1,
        borderTopColor: "#E5E4DD",
        paddingTop: scale(8),
        gap: scale(6),
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    summaryLabel: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Regular",
        color: "#888780",
    },
    summaryValue: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#444441",
    },
    discountValue: {
        color: "#A32D2D",
    },
    totalRow: {
        marginTop: scale(2),
    },
    totalLabel: {
        fontSize: fs(14),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    totalValue: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
    },
});

export default Billing;