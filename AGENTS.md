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

## Project rules
- Opening hours, pickup slots and the loyalty rule live in `src/lib/hours.ts` and are shared by browser and server — the server re-validates slots and prices so clients can't fake them.
- All UI strings go through `src/lib/i18n.tsx` (bg/en dictionary); product names/descriptions carry both languages in `src/lib/bakery.ts`.
- Public form submissions (orders, office subscriptions) insert via server functions in `src/lib/orders.functions.ts` with the admin client; tables are readable only by the `admin` role (first account created becomes admin via trigger).
