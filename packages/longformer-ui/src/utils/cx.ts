export type ClassValue = string | number | null | boolean | undefined;

/** Tiny classnames joiner — avoids pulling in a dependency for portability. */
export function cx(...values: ClassValue[]): string {
  return values.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}
