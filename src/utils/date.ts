export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00Z')
  return date.toLocaleDateString()
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00Z')
}
