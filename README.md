# Майстори пекари (Maistori Pekari)

Website for a Bulgarian bakery, built in Bulgarian for a Bulgarian audience.

Live at **[maistori-pekari.lovable.app](https://maistori-pekari.lovable.app/)**

## What it does

A bakery's website has one job that most of them do badly: show what is actually for sale, with a photograph of each item and a price next to it. Customers are deciding whether to walk over, and a page of stock photos and a phone number does not help them decide.

So the site is built around the product menu. Every item has its own photograph, its own price, and sits in a category a customer would actually think in.

## Notable pieces

**Dual currency pricing.** Every price shows in both euro and leva. Bulgaria is in the middle of its currency changeover, and for a while people will think in one and pay in the other. Showing a single currency would have meant half the customers doing arithmetic in their heads.

**82 product photographs.** The images arrived as Lovable asset pointers rather than real files, which worked inside the editor and broke everywhere else. They were converted to actual JPEGs and committed to the repo, so the site renders the same whether it is served from Lovable, from Cloudflare, or from a local build.

**Bulgarian throughout.** Not a translated English site. The copy, the product names and the category structure were written in Bulgarian first.

## Stack

- React + TypeScript
- Tailwind CSS
- Vite
- Deployed as a Cloudflare Worker

## Development

```bash
git clone https://github.com/milenawebb/maistori-pekari.git
cd maistori-pekari
bun install
bun run dev
```

## Notes

Built with AI-native tooling, primarily Lovable. Content structure and product decisions made by hand.

---

Built by [Milena Webb](https://milenawebb.com) / [fifthexit](https://fifthexit.com).
