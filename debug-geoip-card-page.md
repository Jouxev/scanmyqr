# Debug Session: `geoip-card-page`

Status: [OPEN]
Started: 2026-07-19

## Symptom

- Opening a public business card page like `/card/issam-cars-dealer-3e37452d` throws:
  - `ENOENT: no such file or directory, open '.next\\server\\data\\geoip-country.dat'`
- Stack points to `geoip-lite` while generating `app/card/[slug]/page.tsx`.

## Initial Hypotheses

1. `geoip-lite` is imported eagerly in the public card page, and its data files are unavailable in the App Router page bundle.
2. The crash occurs during module initialization, before the visit counter logic executes.
3. The public page can continue to count visits even if geolocation data is unavailable by falling back to `null` country/city values.
4. The QR scan API route may avoid the crash because its runtime packaging differs from the server component page bundle.
5. A lazy import with guarded fallback will preserve analytics while preventing the page from failing to render.

## Evidence Plan

- Inspect `app/card/[slug]/page.tsx` and compare it with `app/api/r/[code]/route.ts`.
- Add minimal instrumentation around the visit tracking path to confirm whether the failure happens at geoip import/load time.
- Apply the smallest fix that preserves visit counting and gracefully degrades geolocation.
