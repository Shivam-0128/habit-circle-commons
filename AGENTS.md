<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Signed-in pages live under `src/routes/_authenticated/` (client-only gate, redirects to /signin); data is read/written directly via the browser client, with access enforced by RLS (owner-only writes; shared habits readable by all members).
- Habit stats (last 7 days, days done, streak) live in `src/lib/habit-stats.ts` with tests in `src/test/` — keep date math there so it stays tested.
