import { scale } from "@/utils/scale";
import Fontisto from "@expo/vector-icons/Fontisto";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";

type Props = {
    size?: number;
    color?: string;
    duration?: number;
    style?: ViewStyle;
};

const Spinner: React.FC<Props> = ({
    size = scale(24),
    color = "#234338",
    duration = 1000,
    style,
}) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, [spinValue, duration]);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <Animated.View style={[{ transform: [{ rotate }] }, style]}>
            <Fontisto name="spinner-rotate-forward" size={size} color={color} />
        </Animated.View>
    );
};

export default Spinner;