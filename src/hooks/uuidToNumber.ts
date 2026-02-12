export function uuidToNumber(uuid: string): number {
  return parseInt(uuid.replace(/-/g, "").slice(0, 12), 16);
}
