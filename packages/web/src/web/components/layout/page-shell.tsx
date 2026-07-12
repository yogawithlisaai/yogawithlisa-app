import type { ReactNode } from "react";
import { Nav } from "./nav";
import { Footer } from "./footer";

export function PageShell({ children, heroDark = false }: { children: ReactNode; heroDark?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-white)]">
      <Nav overDark={heroDark} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
