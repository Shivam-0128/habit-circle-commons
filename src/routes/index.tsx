import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Habit Circle — track daily habits together" },
      { name: "description", content: "A small community habit tracker for friends and colleagues. Keep habits private or share them to discuss." },
      { property: "og:title", content: "Habit Circle — track daily habits together" },
      { property: "og:description", content: "Track daily habits, keep some private, share others and discuss them in the comments." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Habit Circle</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight text-foreground">Small habits, kept together.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tick off your days, keep some habits to yourself, and share others with your circle to swap advice.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg"><Link to="/signup">Sign up</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/signin">Sign in</Link></Button>
        </div>
      </div>
    </main>
  );
}
