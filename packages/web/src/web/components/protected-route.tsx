import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--color-ink-soft)]">
        Loading...
      </div>
    );
  }
  if (!session) return <Redirect to="/sign-in" />;

  return <>{children}</>;
}
