# Hang Ban Scanner
## Project intent
Hang Ban Scanner is a flight meta-search web app demo built to prove that a real working product can be shipped quickly.
Optimize this repo for fast MVP delivery, real flight search using a real provider, and clean enough foundations to keep building after the demo.

## Product goal
Build a Next.js web app that lets users search and compare flights, then click out to book.
This is a meta-search product, not an in-app booking engine.

## Primary demo goal
Make it obvious that:
- the app can search real flights
- the app can handle country-to-country intent
- the app can surface flexible-date and cheapest-period insights
- the app can capture real email alerts
- the app feels polished enough to be believable

## MVP scope
Prioritize:
1. live flight search with Skyscanner first
2. one-way and round-trip searches
3. country-to-country search by expanding countries into major airports
4. flexible dates / cheapest month using Skyscanner indicative data when possible
5. filters, especially airline filters
6. outbound booking links
7. real email price alerts without requiring accounts

Do not build in v1 unless explicitly asked:
- in-app booking and payments
- user auth / accounts
- full admin panel
- complex SEO content system
- loyalty / points support
- multi-city

## Demo focus
Architect for many origins and destinations, but optimize the first great demo for Singapore outbound.
Priority destination countries for demo polish:
- Japan
- China
- Malaysia
- USA
- UK
Use a curated set of major airports per country in v1. Do not attempt exhaustive airport coverage on day one.

## Flight data strategy
Provider priority:
1. Skyscanner Flights Live Prices for live search
2. Skyscanner Flights Indicative Prices for flexible / exploratory pricing where useful
3. clearly labeled fallback demo mode only if credentials, rate limits, or provider gaps block verification

Rules:
- never invent live prices or present fake results as real
- never silently mix mock data into a real-results view
- if a fallback is required, label it clearly in code and UI
- keep provider-specific logic behind adapters
- normalize all provider responses into internal domain models before the UI reads them

## Country-to-country search rules
Treat provider APIs as route searches that the app orchestrates.
Implement country-to-country search by:
- mapping each country to a curated set of major airports
- fan-out searching relevant airport pairs
- merging, deduplicating, and ranking results
- exposing the best airport combinations back to the UI
Do not over-fan-out blindly. Use pragmatic limits, caching, and ranking so the demo stays responsive.

## Tech stack defaults
Use by default unless explicitly changed:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- PostgreSQL
- Zod
- Resend for email alerts
Prefer simple dependencies over large abstraction layers.

## Deployment defaults
Assume GitHub for source control, Vercel for deployment, and environment variables managed through local env files and Vercel project settings.
Never hardcode secrets. Never commit API keys, tokens, or database URLs.

## Architecture rules
Keep the app easy to explain and easy to extend.
Required boundaries:
- `app/` for routes and page composition
- `components/` for reusable UI
- `lib/providers/` for external provider adapters
- `lib/search/` for orchestration, ranking, filtering, deduping, and caching
- `lib/email/` for alert sending and templates
- `lib/db/` or `prisma/` for persistence
- `lib/types/` or equivalent for normalized domain types

Rules:
- keep pages thin
- put search orchestration in server-only modules
- prefer server components by default
- use client components only when interactivity requires them
- keep URL search params as the source of truth for search state
- make search results pages shareable via URL
- keep provider adapters swappable

## Data model expectations
Design for at least these entities:
- Country
- Airport
- Airline
- Provider
- SearchCache
- FlightAlert
- AlertDeliveryLog
Optional if useful:
- userless alert subscription token model
- RoutePopularity / FeaturedRoute
- SearchAnalyticsEvent
Because auth is out of scope, email alerts should work without accounts.
Use email-based alerts with a secure tokenized unsubscribe / manage flow.

## UX rules
The product should feel premium and fast.
Required traits:
- mobile-first
- clean search-focused landing page
- homepage defaults tuned for Singapore demo flow
- clear loading, empty, and error states
- clear disclaimer that prices can change on provider checkout
- strong result cards with airline, times, duration, stops, price, and outbound CTA
- obvious flexible-date / cheapest-period entry points where supported
Prefer clarity over decoration.

## Coding rules  
Bias for MVP speed, but keep the codebase maintainable.
Do:
- write small, composable modules
- prefer explicit types for public interfaces
- use `any` only at unavoidable provider boundaries, then normalize immediately
- validate external inputs with Zod
- keep comments short and useful
- leave concise TODOs only when truly necessary
Do not:
- overengineer patterns before they are needed
- introduce heavy state libraries unless a simple approach fails
- bury business logic inside UI components
- add auth scaffolding unless explicitly requested

## Working style
1. Start with the smallest working slice that proves value.
2. Ask before making major architecture, provider, schema, or deployment changes.
3. Prefer one real end-to-end path over many half-built paths.
4. If blocked by credentials or provider access, build the production-shaped path anyway and document the exact missing piece.
5. Keep a short running note of assumptions when an API behavior is uncertain.
Major changes that require confirmation:
- switching away from Skyscanner-first
- changing database choice
- changing deployment choice
- adding auth
- changing the country-to-country strategy substantially
- replacing real email delivery with a fake alert flow

## Quality bar before saying a task is done
Before declaring work complete, try to run:
- `npm run lint`
- `npm run typecheck`
- `npm run test` if tests exist for touched logic
- `npm run build` for major milestones
If a check cannot run, say exactly why.

## Initial build order
Unless asked otherwise, work in this order:
1. scaffold app shell and design system
2. define normalized flight schemas and provider adapter interface
3. integrate Skyscanner live search for a single real search path
4. add country-to-country airport expansion
5. add search results ranking, filters, and shareable URLs
6. add flexible-date / cheapest-period support
7. add email price alerts
8. polish Singapore-outbound demo routes
9. add targeted tests for core search logic
10. harden for deployment

## Definition of success
A successful MVP should let a user open the site, search from Singapore to at least one supported destination country, see believable normalized live results, filter results, click out to a booking/provider page, and create a real email alert.

## Communication style for Claude
When helping in this repo:
- be decisive
- keep explanations short
- show changed files clearly
- call out assumptions and blockers plainly
- do not pad responses with theory when implementation is the priority
