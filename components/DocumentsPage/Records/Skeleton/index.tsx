import { scale } from "@/utils/scale";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    View,
} from "react-native";

const RecordSkeleton: React.FC = () => {
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                styles.RecordContainer,
                { opacity },
            ]}
        >
            <View style={styles.RecordTop}>
                {/* Thumbnail placeholders */}
                <View style={styles.Thumbs}>
                    <View style={styles.Thumbnail} />
                    <View style={styles.Thumbnail} />
                    <View style={styles.Thumbnail} />
                </View>

                {/* Record name placeholder */}
                <View style={styles.NameContainer}>
                    <View style={styles.NameLine} />
                    <View style={styles.NameLineShort} />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    RecordContainer: {
        width: "90%",
        alignSelf: "center",
        elevation: 2,
        backgroundColor: "white",
        borderRadius: scale(40),
        padding: scale(8),
        marginBottom: scale(12),
        overflow: "hidden",
    },
    RecordTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(7),
    },
    Thumbs: {
        flexDirection: "row",
        gap: scale(4),
    },
    Thumbnail: {
        width: scale(48),
        height: scale(60),
        borderRadius: scale(8),
        backgroundColor: "#E5E7EB",
    },
    NameContainer: {
        flex: 1,
        gap: scale(9),
        justifyContent: "center",
        paddingHorizontal: scale(6),
    },
    NameLine: {
        width: "90%",
        height: scale(12),
        borderRadius: scale(6),
        backgroundColor: "#E5E7EB",
    },
    NameLineShort: {
        width: "60%",
        height: scale(12),
        borderRadius: scale(6),
        backgroundColor: "#E5E7EB",
    },
});

export default RecordSkeleton;
