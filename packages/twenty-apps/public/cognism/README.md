# Cognism

**Turn a name into a full B2B profile — enrich any Person or Company with Cognism data.**

## ✨ What you get

- **+15 rich fields** per Person and Company — management level, job function, work history, education, firmographics, tech stack, hiring signals & more
- **Run it anywhere** — from the command menu, as a workflow step, or straight from AI chat
- **Smart matching** — finds the right profile from a LinkedIn URL, email, domain or name, and only writes confident matches
- **Compliance-aware** — the GDPR notification flag and per-number do-not-call flags are stored alongside the contact

## 💳 Billing

Cognism charges on redeem, not on search, so **previews are free and you only pay for records whose full profile was returned.** Not found and skipped records cost nothing.

- **Contact redeem:** $0.25
- **Account redeem:** $0.10

## 🔑 Setup

Set `COGNISM_API_KEY` in Settings → Apps. The key needs Enrich and Redeem entitlements on your Cognism contract; fields outside your entitlements come back empty.

## 🧭 How it works

Cognism is a two-step API. The app runs both steps for you:

1. **Enrich** previews the matches for the identifiers on your record and returns a `redeemId` and a `matchScore` for each.
2. **Redeem** exchanges the ids for the full profiles, in batches of 20.

Set **Minimum match score** (0-100) on the workflow step or tool call to skip weak matches before they are redeemed — and before they are billed.

## 📋 Actions

| Action           | Object  | Trigger                            |
| ---------------- | ------- | ---------------------------------- |
| Enrich People    | Person  | Command menu, workflow, HTTP route |
| Enrich Person    | Person  | Workflow, AI tool                  |
| Enrich Companies | Company | Command menu, workflow, HTTP route |
| Enrich Company   | Company | Workflow, AI tool                  |

Each action takes an **Update fields** mode: overwrite existing values, fill only empty ones (the default), or return the data without writing it.

## 🔗 Linking people to companies

When an enriched Person has no Company, the app matches the returned account by Cognism id, domain, LinkedIn URL, then name, and creates the Company if none exists.
