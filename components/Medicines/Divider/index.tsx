import { scale } from '@/utils/scale';
import Fontisto from '@expo/vector-icons/Fontisto';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    date: Date;
    label: string;
};

const Divider: React.FC<Props> = ({ date, label }) => {
    return (
        <View style={styles.container}>
            {/* Left side — Date */}
            <View style={styles.dateContainer}>
                <View style={styles.iconWrapper}>
                    <Fontisto
                        name="date"
                        size={scale(14)}
                        color="#1F3A2E"
                    />
                </View>

                <Text style={styles.dateText}>
                    {date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </Text>
            </View>

            {/* Center divider */}
            <View style={styles.line} />

            {/* Right side — Label */}
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{label}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: scale(10),
    },

    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(7),
    },

    iconWrapper: {
        width: scale(30),
        height: scale(30),
        borderRadius: scale(10),
        backgroundColor: '#EAF3EE',
        alignItems: 'center',
        justifyContent: 'center',
    },

    dateText: {
        fontFamily: 'Aeonik-Medium',
        fontSize: scale(13),
        color: '#1F3A2E',
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#DDE8E2',
        marginHorizontal: scale(12),
    },

    labelContainer: {
        backgroundColor: '#1F3A2E',
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: scale(20),
    },

    labelText: {
        fontFamily: 'Aeonik-Bold',
        fontSize: scale(12),
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default Divider;
