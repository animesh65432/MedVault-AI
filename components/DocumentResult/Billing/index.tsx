import { BillingItem } from "@/types";
import { fs } from "@/utils/fs";
import { formatAmount, parseAmount } from "@/utils/parseAmount";
import { scale } from "@/utils/scale";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AddBillingModel from "../AddBillingModel";

type Props = {
    items: BillingItem[];
    subtotal?: string;
    discount?: string;
    total?: string;
    isEditable: boolean;
    onUpdateItem: (index: number, field: keyof BillingItem, value: string) => void;
    onRemoveItem: (index: number) => void;
    onAddItem: (item: BillingItem) => void;
    onUpdateSubtotal: (value: string) => void;
    onUpdateDiscount: (value: string) => void;
    onUpdateTotal: (value: string) => void;
};

const Billing: React.FC<Props> = ({
    isEditable,
    items = [],
    subtotal,
    discount,
    total,
    onUpdateItem,
    onRemoveItem,
    onAddItem,
    onUpdateSubtotal,
    onUpdateDiscount
}) => {
    const [showAddBillingModel, setShowAddBillingModel] = useState(false);
    const computedTotal = useMemo(() => {
        const itemsSum = items.reduce((sum, item) => sum + parseAmount(item.price), 0);
        const discountValue = parseAmount(discount);
        return itemsSum - discountValue;
    }, [items, discount]);

    const computedTotalDisplay = formatAmount(computedTotal);

    if (items.length === 0 && !total && !isEditable) return null;

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>Billing</Text>
                {isEditable && (
                    <TouchableOpacity onPress={() => setShowAddBillingModel(true)} hitSlop={8} style={styles.addRow}>
                        <Feather name="plus" size={fs(12)} color="#234338" />
                        <Text style={styles.addRowText}>Add item</Text>
                    </TouchableOpacity>
                )}
            </View>

            {(items.length > 0 || isEditable) && (
                <View style={styles.list}>
                    {items.map((item, index) => (
                        <View key={`${item.name}-${index}`} style={styles.row}>
                            {isEditable ? (
                                <>
                                    <TextInput
                                        value={item.name}
                                        onChangeText={(text) => onUpdateItem?.(index, "name", text)}
                                        style={styles.itemNameInput}
                                        placeholder="Item"
                                        placeholderTextColor="#B4B2A9"
                                    />
                                    <TextInput
                                        value={item.price}
                                        onChangeText={(text) => onUpdateItem?.(index, "price", text)}
                                        style={styles.itemPriceInput}
                                        placeholder="0.00"
                                        placeholderTextColor="#B4B2A9"
                                        keyboardType="numbers-and-punctuation"
                                    />
                                    <TouchableOpacity onPress={() => onRemoveItem?.(index)} hitSlop={8}>
                                        <Feather name="x" size={fs(14)} color="#B3261E" />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.itemName} numberOfLines={2}>
                                        {item.name || "Item"}
                                    </Text>
                                    <Text style={styles.itemPrice}>{item.price}</Text>
                                </>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {(subtotal || discount || total || isEditable) && (
                <View style={styles.summary}>
                    {(!!subtotal || isEditable) && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            {isEditable ? (
                                <TextInput
                                    value={subtotal ?? ""}
                                    onChangeText={onUpdateSubtotal}
                                    style={styles.summaryValueInput}
                                    placeholder="0.00"
                                    placeholderTextColor="#B4B2A9"
                                    keyboardType="numbers-and-punctuation"
                                />
                            ) : (
                                <Text style={styles.summaryValue}>{subtotal}</Text>
                            )}
                        </View>
                    )}
                    {(!!discount || isEditable) && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Discount</Text>
                            {isEditable ? (
                                <TextInput
                                    value={discount ?? ""}
                                    onChangeText={onUpdateDiscount}
                                    style={[styles.summaryValueInput, styles.discountValue]}
                                    placeholder="0.00"
                                    placeholderTextColor="#B4B2A9"
                                    keyboardType="numbers-and-punctuation"
                                />
                            ) : (
                                <Text style={[styles.summaryValue, styles.discountValue]}>
                                    -{discount}
                                </Text>
                            )}
                        </View>
                    )}
                    {(!!total || isEditable) && (
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{computedTotalDisplay}</Text>
                        </View>
                    )}
                </View>
            )}
            {showAddBillingModel &&
                <AddBillingModel
                    isBillingModalVisible={showAddBillingModel}
                    setBillingModalVisible={setShowAddBillingModel}
                    onAddItem={onAddItem}
                />
            }
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
    addRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
    },
    addRowText: {
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
        gap: scale(8),
    },
    itemName: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        flex: 1,
    },
    itemNameInput: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Regular",
        color: "#444441",
        flex: 1,
        padding: 0,
    },
    itemPrice: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
    },
    itemPriceInput: {
        fontSize: fs(13),
        fontFamily: "Aeonik-Medium",
        color: "#0D1F1C",
        padding: 0,
        minWidth: scale(50),
        textAlign: "right",
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
        alignItems: "center",
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
    summaryValueInput: {
        fontSize: fs(12),
        fontFamily: "Aeonik-Medium",
        color: "#444441",
        padding: 0,
        minWidth: scale(50),
        textAlign: "right",
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
    totalValueInput: {
        fontSize: fs(16),
        fontFamily: "Aeonik-Medium",
        color: "#23423B",
        padding: 0,
        minWidth: scale(60),
        textAlign: "right",
    },
    mismatchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6),
        marginTop: scale(2),
    },
    mismatchText: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Regular",
        color: "#A3762D",
        flex: 1,
    },
    mismatchAction: {
        fontSize: fs(11),
        fontFamily: "Aeonik-Medium",
        color: "#234338",
        textDecorationLine: "underline",
    },
});

export default Billing;