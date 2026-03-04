/**
 * AuthLayout — passthrough layout for full-page auth screens.
 * Each auth page manages its own layout internally.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
