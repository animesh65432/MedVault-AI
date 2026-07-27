export const RedirectToTable = (tableName: string): "/Search" | "/Chat" | "/ShowDocument" | "/UploadModal" | "/_sitemap" | "/(tabs)" | "/(tabs)/Alerts" | "/" => {
    switch (tableName) {
        case "Documents":
            return "/Search";
        case "ShowDocument":
            return "/ShowDocument";
        case "UploadModal":
            return "/UploadModal";
        default:
            return "/";
    }
};