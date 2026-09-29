export function formatDate(iso: string | null | undefined) {
    const date = iso ? new Date(iso) : new Date();
    const today = new Date();

    const diffDays = Math.floor(
        (today.getTime() - date.getTime()) / 86400000
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    if (diffDays < 7) {
        return date.toLocaleDateString("en-IN", {
            weekday: "long",
        });
    }

    const sameYear = date.getFullYear() === today.getFullYear();

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: sameYear ? undefined : "numeric",
    });
}