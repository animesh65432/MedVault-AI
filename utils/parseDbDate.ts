export const parseDbDate = (value: string | Date | null | undefined): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const iso = value.includes('T') ? value : value.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
};