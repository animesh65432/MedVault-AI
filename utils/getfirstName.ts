export function GetFirstName(userName: string): string {
    const firstName = userName
        ?.trim()
        .split(/\s+/)[0]
        ?.replace(/^./, char => char.toUpperCase());
    return firstName;
}
