import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Habit Circle" },
      { name: "description", content: "Sign in to Habit Circle." },
      { property: "og:title", content: "Sign in — Habit Circle" },
      { property: "og:description", content: "Sign in to Habit Circle." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/habits" });
  }

  return (
    <AuthCard title="Sign in" footer={<>New here? <Link to="/signup" className="text-primary underline">Sign up</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="em">Email</Label><Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={busy}>Sign in</Button>
      </form>
    </AuthCard>
  );
}
