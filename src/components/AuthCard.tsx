import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthCard({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-soft">
        <Link to="/" className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Habit Circle</Link>
        <h1 className="mt-3 mb-6 text-3xl font-bold">{title}</h1>
        {children}
        <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
      </div>
    </main>
  );
}
