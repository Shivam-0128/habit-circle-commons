import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Habit Circle" },
      { name: "description", content: "Create your Habit Circle account." },
      { property: "og:title", content: "Sign up — Habit Circle" },
      { property: "og:description", content: "Create your Habit Circle account." },
    ],
  }),
  component: SignUp,
});

const schema = z.object({
  displayName: z.string().trim().min(1, "Display name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function SignUp() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ displayName, email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { display_name: parsed.data.displayName }, emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (!data.session) { toast.error("Account created, but sign-in failed. Please sign in."); return; }
    navigate({ to: "/habits" });
  }

  return (
    <AuthCard title="Sign up" footer={<>Already a member? <Link to="/signin" className="text-primary underline">Sign in</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="dn">Display name</Label><Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="em">Email</Label><Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={busy}>Sign up</Button>
      </form>
    </AuthCard>
  );
}
