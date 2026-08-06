export function createSearchParams(
  filters: Record<string, unknown>
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      params.set(key, String(value));
    }
  }

  return params;
}