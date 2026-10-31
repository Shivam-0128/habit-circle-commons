import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({
    meta: [
      { title: "My habits — Habit Circle" },
      { name: "description", content: "Your daily habits." },
      { property: "og:title", content: "My habits — Habit Circle" },
      { property: "og:description", content: "Your daily habits." },
    ],
  }),
  component: MyHabits,
});

function MyHabits() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [when, setWhen] = useState("");
  const [shared, setShared] = useState(false);

  const habits = useQuery({
    queryKey: ["my-habits", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("habits").select("id,name,is_shared").eq("user_id", user.id).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("habits").insert({ user_id: user.id, name: name.trim(), when_i_do_it: when.trim(), is_shared: shared });
      if (error) throw error;
    },
    onSuccess: () => {
      setName(""); setWhen(""); setShared(false);
      qc.invalidateQueries({ queryKey: ["my-habits"] });
      qc.invalidateQueries({ queryKey: ["community"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">My habits</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return toast.error("Habit name is required"); add.mutate(); }}
        className="space-y-4 rounded-xl border bg-card p-6 shadow-soft"
      >
        <div className="space-y-1.5"><Label htmlFor="hn">Habit name</Label><Input id="hn" maxLength={200} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-1.5">
          <Label htmlFor="wh">When I do it</Label>
          <Textarea id="wh" maxLength={2000} placeholder="e.g. Right after my morning coffee, when the house is still quiet" value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="sh" checked={shared} onCheckedChange={(v) => setShared(v === true)} />
          <Label htmlFor="sh">Share with the community</Label>
        </div>
        <Button type="submit" disabled={add.isPending}>Add habit</Button>
      </form>

      <ul className="divide-y rounded-xl border bg-card">
        {habits.data?.length === 0 && <li className="p-6 text-muted-foreground">No habits yet — add your first one above.</li>}
        {habits.data?.map((h) => (
          <li key={h.id} className="flex items-center justify-between p-4">
            <Link to="/habits/$id" params={{ id: h.id }} className="font-medium hover:underline">{h.name}</Link>
            <Badge variant={h.is_shared ? "default" : "secondary"} className={h.is_shared ? "bg-shared text-shared-foreground" : ""}>
              {h.is_shared ? "Shared" : "Private"}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
