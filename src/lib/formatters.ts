export function formatCurrency(value: number, currencyCode: string, locale: string = 'en-US'): string {
  // Input validation
  if (typeof value !== 'number' || isNaN(value)) {
    console.error("formatCurrency: Invalid 'value' provided. Expected a number.");
    return 'Invalid Amount'; // Or return an empty string, or throw an error
  }

  value = value/100
  if (typeof currencyCode !== 'string' || currencyCode.trim().length !== 3) {
    console.error(`formatCurrency: Invalid 'currencyCode' provided: '${currencyCode}'. Expected a 3-letter string (e.g., 'USD').`);
    // Fallback to basic number formatting if currencyCode is invalid
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2, // Ensures at least two decimal places
      maximumFractionDigits: 2, // Ensures at most two decimal places
    }).format(value);
  } catch (error) {
    console.error(`Error formatting currency for value '${value}' and currency '${currencyCode}':`, error);
    return value.toLocaleString(locale);
  }
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
}