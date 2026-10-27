export function cleanEnvValue(value: string | undefined): string | undefined {
  return value?.replace(/(?:\s|\\[nr])+$/, "").trim();
}
