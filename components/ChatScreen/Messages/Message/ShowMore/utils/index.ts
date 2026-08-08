export const RedirectToTable = (tableName: string): "/Search" | "/Chat" | "/ShowDocument" | "/UploadModal" | "/_sitemap" | "/(tabs)" | "/(tabs)/Alerts" | "/(tabs)/Medicines" | "/" => {
    switch (tableName) {
        case "Documents":
            return "/Search";
        case "Medicines":
            return "/(tabs)/Medicines";
        case "Reminders":
            return "/(tabs)/Alerts";
        default:
            return "/";
    }
};