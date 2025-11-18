'use-client';

export const formatMonthYear = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString === 'Present') return dateString;

    // Parse the date string (format: YYYY-MM)
    const [year, month] = dateString.split('-');

    const date = new Date(parseInt(year), parseInt(month) - 1, 1);

    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};
