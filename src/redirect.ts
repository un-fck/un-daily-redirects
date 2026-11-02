export const destination = 'https://daily.unfck.org/about';
export const animationDurationMs = 8000;
export const reducedMotionDurationMs = 1500;
/** Only the single showcase timeline can complete navigation, never a bubbled child event. */
export function completionDestination(name: string, rootEvent: boolean): string | null {
  return rootEvent && ['unite', 'settled'].includes(name) ? destination : null;
}
