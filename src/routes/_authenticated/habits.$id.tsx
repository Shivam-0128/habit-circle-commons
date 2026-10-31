import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { currentStreak, daysDone, lastDays } from "@/lib/habit-stats";

export const Route = createFileRoute("/_authenticated/habits/$id")({
  head: () => ({
    meta: [
      { title: "Habit — Habit Circle" },
      { name: "description", content: "Track a habit over the last 7 days and discuss it." },
      { property: "og:title", content: "Habit — Habit Circle" },
      { property: "og:description", content: "Track a habit over the last 7 days and discuss it." },
    ],
  }),
  component: HabitPage,
});

function HabitPage() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [comment, setComment] = useState("");

  const habit = useQuery({
    queryKey: ["habit", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("habits").select("id,name,when_i_do_it,is_shared,user_id,profiles(display_name)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const completions = useQuery({
    queryKey: ["completions", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("completions").select("day").eq("habit_id", id);
      if (error) throw error;
      return data.map((c) => c.day);
    },
  });
  const comments = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("comments").select("id,body,created_at,profiles(display_name)").eq("habit_id", id).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ day, done }: { day: string; done: boolean }) => {
      const { error } = done
        ? await supabase.from("completions").insert({ habit_id: id, day })
        : await supabase.from("completions").delete().eq("habit_id", id).eq("day", day);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["completions", id] }); qc.invalidateQueries({ queryKey: ["community"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const post = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("comments").insert({ habit_id: id, user_id: user.id, body: comment.trim() });
      if (error) throw error;
    },
    onSuccess: () => { setComment(""); qc.invalidateQueries({ queryKey: ["comments", id] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (habit.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!habit.data) return <p className="text-muted-foreground">This habit isn't available.</p>;

  const h = habit.data;
  const isOwner = h.user_id === user.id;
  const done = completions.data ?? [];
  const doneSet = new Set(done);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-muted-foreground">{h.profiles?.display_name} · {h.is_shared ? "Shared" : "Private"}</p>
        <h1 className="mt-1 text-4xl font-bold">{h.name}</h1>
        {h.when_i_do_it && <p className="mt-3 whitespace-pre-wrap text-lg text-muted-foreground">{h.when_i_do_it}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 rounded-xl border bg-card p-5 shadow-soft"><span className="text-muted-foreground">Days done:</span> <span className="font-display text-2xl font-bold">{daysDone(done)}</span></div>
        <div className="flex-1 rounded-xl border bg-card p-5 shadow-soft"><span className="text-muted-foreground">Current streak:</span> <span className="font-display text-2xl font-bold">{currentStreak(done)}</span></div>
      </div>

      <section>
        <h2 className="mb-3 text-2xl font-bold">Last 7 days</h2>
        <ul className="divide-y rounded-xl border bg-card">
          {lastDays(7).map((day) => (
            <li key={day} className="flex items-center gap-3 p-3">
              <Checkbox
                id={`d-${day}`}
                checked={doneSet.has(day)}
                disabled={!isOwner || toggle.isPending}
                onCheckedChange={(v) => toggle.mutate({ day, done: v === true })}
              />
              <Label htmlFor={`d-${day}`} className="font-mono">{day}</Label>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <ul className="space-y-3">
          {comments.data?.length === 0 && <li className="text-muted-foreground">No comments yet.</li>}
          {comments.data?.map((c) => (
            <li key={c.id} className="rounded-xl border bg-card p-4">
              <p className="text-sm font-semibold">{c.profiles?.display_name}</p>
              <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={(e) => { e.preventDefault(); if (comment.trim()) post.mutate(); }} className="space-y-2">
          <Label htmlFor="cm">Comment</Label>
          <Textarea id="cm" maxLength={2000} value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button type="submit" disabled={post.isPending}>Post comment</Button>
        </form>
      </section>
    </div>
  );
}
