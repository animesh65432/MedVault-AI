import { fs } from "@/utils/fs";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
    targetValue: number;
    duration?: number;
};

const AnimatedCounter: React.FC<Props> = ({
    targetValue,
    duration = 1000,
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const currentValue = Math.floor(progress * targetValue);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [targetValue, duration]);

    return <Text style={styles.count}>{count}</Text>;
};

const styles = StyleSheet.create({
    count: {
        fontSize: fs(24),
        fontWeight: "bold",
        color: "white",
    },
});

export default AnimatedCounter;
