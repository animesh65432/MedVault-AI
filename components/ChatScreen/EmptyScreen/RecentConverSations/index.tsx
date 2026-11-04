import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { AntDesign, Entypo } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const COLORS = {
    text: 'black',
    accent: '#23423B',
    muted: '#6B7280',
};

type Props = {
    title?: string;
    time?: string;
    onSeeAllPress?: () => void;
    onPress?: () => void;
};

const RecentConversations: React.FC<Props> = ({
    title = 'DR SEN PRESCRIPTION',
    time = '2hr ago',
    onSeeAllPress,
    onPress,
}) => {
    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.heading}>Recent Conversations</Text>
                <Pressable
                    style={styles.seeAll}
                    onPress={onSeeAllPress}
                    hitSlop={scale(8)}
                    accessibilityRole="button"
                    accessibilityLabel="See all conversations"
                >
                    <Text style={styles.seeAllText}>See All</Text>
                    <AntDesign name="arrow-right" size={fs(15)} color={COLORS.accent} />
                </Pressable>
            </View>

            <Pressable
                style={styles.item}
                onPress={onPress}
                accessibilityRole="button"
            >
                <Entypo name="chat" size={scale(24)} color={COLORS.text} />
                <View style={styles.itemContent}>
                    <Text
                        style={styles.itemTitle}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text style={styles.itemTime}>{time}</Text>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heading: {
        fontSize: fs(22),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.text,
    },
    seeAll: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    seeAllText: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.accent,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        marginTop: scale(12),
        backgroundColor: "white",
        padding: scale(10),
        borderRadius: scale(18),
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: fs(15),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.text,
    },
    itemTime: {
        fontSize: fs(12),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.muted,
    },
});

export default RecentConversations;