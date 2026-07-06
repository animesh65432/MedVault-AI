import { Reminder } from "@/types";

export const fixInitialTimes = (reminder: Reminder[]): Date[] => {
    return reminder.map((r) => {
        if (r.times && r.times.length > 0) {
            return r;
        } else {
            return { ...r, times: [] };
        }
    });
}