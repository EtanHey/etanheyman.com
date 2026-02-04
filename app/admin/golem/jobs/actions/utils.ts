// Escape special characters for PostgREST ilike filters
export function escapePostgrestSearch(search: string): string {
  // Escape characters that have special meaning in PostgREST filters
  // Commas separate conditions, % and _ are wildcards
  return search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/,/g, '\\,');
}
