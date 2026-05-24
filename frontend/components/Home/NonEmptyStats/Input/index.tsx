import React, { useRef, useState } from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    Animated,
    TouchableOpacity,
    TextInputProps,
} from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { vScale } from "@/utils/vScale"
import { scale } from '@/utils/scale';

interface InputProps extends TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({
    value,
    onChangeText,
    placeholder = "Search your medical history...",
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const borderAnim = useRef(new Animated.Value(0)).current;
    const iconAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.parallel([
            Animated.spring(borderAnim, {
                toValue: 1,
                damping: 16,
                stiffness: 140,
                useNativeDriver: false,
            }),
            Animated.timing(iconAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.parallel([
            Animated.spring(borderAnim, {
                toValue: 0,
                damping: 18,
                stiffness: 120,
                useNativeDriver: false,
            }),
            Animated.timing(iconAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const animatedBorderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(238, 246, 162, 0.12)", "rgba(238, 246, 162, 0.55)"],
    });

    const animatedIconColor = iconAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgba(238, 246, 162, 0.35)", "rgba(238, 246, 162, 1)"],
    });

    const animatedBackground = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#1E3A33", "#213f38"],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    borderColor: animatedBorderColor,
                    backgroundColor: animatedBackground,
                },
            ]}
        >
            {/* Search Icon */}
            <Animated.View style={{ marginRight: scale(10) }}>
                <Ionicons
                    name="search-outline"
                    size={scale(18)}
                    color={isFocused ? "#EEF6A2" : "rgba(238, 246, 162, 0.35)"}
                />
            </Animated.View>

            {/* Input */}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(238, 246, 162, 0.3)"
                style={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                selectionColor="#EEF6A2"
                {...rest}
            />

            {/* Clear button */}
            {value && value.length > 0 && (
                <TouchableOpacity
                    onPress={() => onChangeText?.("")}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.clearButton}
                >
                    <Ionicons
                        name="close-circle"
                        size={scale(16)}
                        color="rgba(238, 246, 162, 0.45)"
                    />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: vScale(14),
        borderWidth: 1,
        paddingHorizontal: scale(14),
        paddingVertical: vScale(13),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: vScale(4) },
        shadowOpacity: 0.15,
        shadowRadius: vScale(8),
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: scale(14),
        color: "#EEF6A2",
        fontFamily: "Aeonik-Medium",
        padding: 0,
        margin: 0,
    },
    clearButton: {
        marginLeft: scale(8),
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Input;