import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Home, Users, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/signin" });
    return { user: data.user };
  },
  component: Layout,
});

function Layout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/signin", replace: true });
  }

  const sideBtn = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent";
  const sideActive = { className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar p-5 md:flex">
        <div className="mb-8 font-display text-2xl font-bold text-sidebar-foreground">Habit Circle</div>
        <nav className="space-y-1">
          <Link to="/habits" className={sideBtn} activeProps={sideActive}><Home /> My habits</Link>
          <Link to="/community" className={sideBtn} activeProps={sideActive}><Users /> Community</Link>
        </nav>
        <button onClick={signOut} className={`${sideBtn} mt-auto`}><LogOut /> Sign out</button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-6 py-3">
          <nav className="flex gap-5 text-sm font-medium">
            <Link to="/habits" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground underline underline-offset-8" }}>My habits</Link>
            <Link to="/community" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground underline underline-offset-8" }}>Community</Link>
          </nav>
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10"><Outlet /></main>
      </div>
    </div>
  );
}
