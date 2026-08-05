import { Reminder } from "@/types";
import * as Notifications from 'expo-notifications';

export const useNotification = () => {
    const addAlarm = async (reminder: Reminder) => {
        try {
            const trigger = buildTrigger(reminder);

            const notificationId = await Notifications.scheduleNotificationAsync({
                identifier: String(reminder.Id!),
                content: {
                    title: reminder.title,
                    sound: 'default',
                    data: { reminderId: reminder.Id },
                },
                trigger,
            });

            return notificationId;
        } catch (error) {
            console.error('[useNotification] addAlarm failed:', error);
            throw error;
        }
    };

    const removeAlarm = async (notificationId: string) => {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            console.error('[useNotification] removeAlarm failed:', error);
            throw error;
        }
    };

    return { addAlarm, removeAlarm };
};

function buildTrigger(reminder: Reminder): Notifications.NotificationTriggerInput {
    switch (reminder.repeat) {
        case 'daily':
            return {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: reminder.time.getHours(),
                minute: reminder.time.getMinutes(),
                channelId: 'medicine-reminders',
            };
        case 'weekly':
            return {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: reminder.time.getDay() + 1,
                hour: reminder.time.getHours(),
                minute: reminder.time.getMinutes(),
                channelId: 'medicine-reminders',
            };
        case 'once':
            return {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminder.time,
                channelId: 'medicine-reminders',
            };
    }
}