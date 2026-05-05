export function createToken(x: number, y: number) {
  return {
    id: crypto.randomUUID(),
    x,
    y
  };
}