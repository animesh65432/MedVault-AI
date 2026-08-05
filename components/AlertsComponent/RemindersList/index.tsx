import { ReminderWithMedicine } from '@/types';
import { fs } from '@/utils/fs';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Empty from './Empty';
import Reminder from './Reminder';

type Props = {
    Reminders: ReminderWithMedicine[];
    OntoggoleAlert: (id: number, value: boolean) => void;
    onLoadMore: () => void;
    hasMore: boolean;
    loadingMore: boolean;
    IsLoading: boolean;
    OnDeleteReminder: (id: number) => Promise<void>;
}

const RemindersList: React.FC<Props> = ({ OnDeleteReminder, IsLoading, Reminders, OntoggoleAlert, onLoadMore, hasMore, loadingMore }) => {
    const handleScrollEnd = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const distanceFromBottom =
            contentSize.height - (contentOffset.y + layoutMeasurement.height);

        if (distanceFromBottom < scale(60) && hasMore && !loadingMore) {
            onLoadMore();
        }
    };

    if (IsLoading) {
        return <ActivityIndicator
            style={styles.MainSpinner}
            color="#234338"
            size={scale(30)}
        />
    }

    if (Reminders.length === 0 && !IsLoading) {
        return (
            <Empty />
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.UpcomingText}>Upcoming</Text>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
            >
                {Reminders.map((reminder) => (
                    <Reminder
                        key={reminder.Id}
                        reminder={reminder}
                        onToggle={OntoggoleAlert}
                        OnDeleteReminder={OnDeleteReminder}
                    />
                ))}
                {loadingMore && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color="#0D483F" />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: scale(10),
        paddingHorizontal: scale(20),
        marginTop: scale(10)
    },
    scrollContent: {
        paddingBottom: scale(180),
    },
    UpcomingText: {
        fontSize: fs(20),
        fontFamily: "Aeonik-Medium"
    },
    loaderContainer: {
        paddingVertical: scale(16),
        alignItems: 'center',
    },
    MainSpinner: {
        marginVertical: vScale(166)
    }
})
export default RemindersList