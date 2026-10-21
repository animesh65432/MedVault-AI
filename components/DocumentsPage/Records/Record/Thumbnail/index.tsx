import { DocumentRow } from "@/types";
import { fs } from "@/utils/fs";
import { scale } from "@/utils/scale";
import React from "react";
import { StyleSheet, View } from "react-native";
import RecordImage from "./RecordImage";

type Props = {
    docs: DocumentRow[];
};

const W = scale(96);
const H = scale(72);
const BORDER = scale(3);
const RADIUS = scale(14);

type Slot = { size: number; left: number; rotate: string; z: number };

const s = (n: number) => scale(n);

const LAYOUTS: Record<number, Slot[]> = {
    1: [{ size: s(60), left: (W - s(60)) / 2, rotate: "0deg", z: 1 }],
    2: [
        { size: s(52), left: s(4), rotate: "-8deg", z: 1 },
        { size: s(52), left: W - s(52) - s(4), rotate: "7deg", z: 2 },
    ],
    3: [
        { size: s(44), left: 0, rotate: "-10deg", z: 1 },
        { size: s(58), left: (W - s(58)) / 2, rotate: "0deg", z: 3 },
        { size: s(44), left: W - s(44), rotate: "10deg", z: 2 },
    ],
};

const Thumbnail: React.FC<Props> = ({ docs }) => {
    if (!docs || docs.length === 0) return null;

    const layout = LAYOUTS[docs.length];

    return (
        <View style={styles.Container}>
            {docs.map((d, i) => {
                const { size, left, rotate, z } = layout[i];
                return (
                    <View
                        key={d.Id}
                        style={[
                            styles.Card,
                            {
                                width: size,
                                height: size,
                                left,
                                top: (H - size) / 2,
                                zIndex: z,
                                transform: [{ rotate }],
                            },
                        ]}
                    >
                        <RecordImage
                            document={d}
                            IsPdf={d.IsPdf}
                            size={size - BORDER * 2}
                            radius={RADIUS - BORDER}
                        />
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        width: W,
        height: H,
    },
    Card: {
        position: "absolute",
        padding: BORDER,
        backgroundColor: "white",
        borderRadius: RADIUS,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    Badge: {
        position: "absolute",
        right: -scale(4),
        bottom: -scale(2),
        zIndex: 10,
        minWidth: scale(24),
        height: scale(24),
        paddingHorizontal: scale(6),
        borderRadius: scale(12),
        backgroundColor: "#1A73E8",
        borderWidth: 2,
        borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
    BadgeText: {
        fontFamily: "Aeonik-Medium",
        fontSize: fs(11),
        color: "white",
    },
});

export default Thumbnail;