export const RedirectToTable = (tableName: string): "/Documents" | "/Search" | "/Chat" | "/ShowDocument" | "/UploadModal" | "/_sitemap" | "/(tabs)" | "/(tabs)/Alerts" | "/(tabs)/Medicines" | "/" => {
    switch (tableName) {
        case "Documents":
            return "/Documents";
        case "Medicines":
            return "/(tabs)/Medicines";
        case "Reminders":
            return "/(tabs)/Alerts";
        case "Records":
            return "/Documents"
        default:
            return "/";
    }
};