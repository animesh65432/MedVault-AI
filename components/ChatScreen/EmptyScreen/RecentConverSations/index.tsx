import { RecentCoversation } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const COLORS = {
    text: 'black',
    accent: '#06441c',
    muted: '#6B7280',
};

type Props = {
    recentDocuments: RecentCoversation[];
    setChatRecordId: React.Dispatch<React.SetStateAction<number | null>>;
};

const RecentConversations: React.FC<Props> = ({
    recentDocuments,
    setChatRecordId
}) => {
    const router = useRouter();
    if (!recentDocuments || recentDocuments.length === 0) {
        return null;
    }

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.heading}>Recent Conversations</Text>
                <Pressable
                    style={styles.seeAll}
                    onPress={() => router.push("/ChatHistory")}
                    hitSlop={scale(8)}
                    accessibilityRole="button"
                    accessibilityLabel="See all conversations"
                >
                    <Text style={styles.seeAllText}>See All</Text>
                    <AntDesign
                        name="arrow-right"
                        size={fs(15)}
                        color={COLORS.accent}
                    />
                </Pressable>
            </View>

            <Pressable
                style={styles.item}
                accessibilityRole="button"
                onPress={() => setChatRecordId(recentDocuments[0].Id)}
            >
                <MaterialIcons
                    name="chat"
                    size={scale(24)}
                    color="#085f27"
                />
                <View style={styles.itemContent}>
                    <Text
                        style={styles.itemTitle}
                        numberOfLines={1}
                    >
                        {recentDocuments[0].Name}
                    </Text>
                </View>
                <View style={styles.arrowIconContainer}>
                    <Text style={styles.itemTime}>{formatDate(recentDocuments[0].CreatedAt)}</Text>
                    <FontAwesome5
                        name="chevron-right"
                        size={scale(14)}
                        color={COLORS.accent}
                    />
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
        fontSize: fs(16),
        fontFamily: 'Aeonik-Medium',
        color: "#03220e",
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        marginTop: scale(12),
        backgroundColor: "white",
        padding: scale(12),
        borderRadius: scale(18),
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: fs(16),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.text,
    },
    itemTime: {
        fontSize: fs(12),
        fontFamily: 'Aeonik-Medium',
        color: COLORS.muted,
    },
    arrowIconContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(8),
    }
});

export default RecentConversations;