export function circularDistance(value: number, target: number, min: number, max: number): number {
  const range = max - min;
  const from = value - min;
  const to = target - min;

  if (to >= from) {
    return to - from;
  } else {
    return range - from + to;
  }
}
