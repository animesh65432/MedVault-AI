import { scale } from "@/utils/scale";
import { vScale } from "@/utils/vScale";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";


const TypingDots: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const bounce = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: -4, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.delay(450 - delay),
                ])
            );

        const anim1 = bounce(dot1, 0);
        const anim2 = bounce(dot2, 150);
        const anim3 = bounce(dot3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, []);

    return (
        <View style={style.typingBubble}>
            <Animated.View style={[style.typingDot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[style.typingDot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[style.typingDot, { transform: [{ translateY: dot3 }] }]} />
        </View>
    );
};

const style = StyleSheet.create({
    typingBubble: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(4),
        backgroundColor: "#FAFAF8",
        borderRadius: scale(18),
        borderTopLeftRadius: scale(4),
        paddingHorizontal: scale(16),
        paddingVertical: vScale(14),
        borderWidth: 1,
        borderColor: "#0D1F1C10",
    },
    typingDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: "#0D1F1C60",
    }
})

export default TypingDots;