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
                    data: {
                        reminderId: reminder.Id,
                    },
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
    const time = reminder.time instanceof Date ? reminder.time : new Date(reminder.time);
    switch (reminder.repeat) {
        case 'daily':
            return {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: time.getHours(),
                minute: time.getMinutes(),
                channelId: 'medicine-reminders',
            };
        case 'weekly':
            return {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: time.getDay() + 1,
                hour: time.getHours(),
                minute: time.getMinutes(),
                channelId: 'medicine-reminders',
            };
        case 'once':
            return {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: time,
                channelId: 'medicine-reminders',
            };
    }
}