export function parseAmount(value: string | undefined): number {
    if (!value) return 0;
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatAmount(value: number): string {
    return value.toFixed(2);
}