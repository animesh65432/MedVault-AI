import { scale } from "@/utils/scale"
import { vScale } from "@/utils/vScale"
import Feather from "@expo/vector-icons/Feather"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type Props = {
    count: number
    onClose: () => void
    onShare?: () => void
    onDelete?: () => void
}

const BelowNavbar: React.FC<Props> = ({ count, onClose, onShare, onDelete }) => {
    const slide = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.spring(slide, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 80,
        }).start()
    }, [slide])

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: slide,
                    transform: [
                        {
                            translateY: slide.interpolate({
                                inputRange: [0, 1],
                                outputRange: [vScale(40), 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onClose}
                hitSlop={8}
                activeOpacity={0.7}
            >
                <Feather name="x" size={scale(20)} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.countText}>{count} selected</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onShare}
                    hitSlop={8}
                    activeOpacity={0.7}
                >
                    <Feather name="share-2" size={scale(19)} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={onDelete}
                    hitSlop={8}
                    activeOpacity={0.7}
                >
                    <Feather name="trash-2" size={scale(19)} color="#FFB4A8" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: vScale(80),
        alignSelf: "center",
        width: "88%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: vScale(10),
        paddingHorizontal: scale(14),
        backgroundColor: "#23423B",
        borderRadius: scale(40),
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        zIndex: 200,
    },
    iconButton: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.12)",
    },
    countText: {
        flex: 1,
        marginLeft: scale(12),
        fontFamily: "Aeonik-Medium",
        fontSize: scale(15),
        color: "#FFFFFF",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
    },
})

export default BelowNavbar