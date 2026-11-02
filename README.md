# UNFCK redirects

An independent, unofficial demonstration connecting seven shadow domains to
https://daily.unfck.org/about. No official emblems, analytics, authentication or backend.

## Development

Use Node 24 LTS or later (Node 25 also works), then:

```sh
npm ci
npm run dev
```

Vite binds to `127.0.0.1:5174` with a strict port: it fails rather than taking a
neighbouring port. Check for an existing server before starting another.

Local previews:

- `http://localhost:5174/?site=journal`
- `http://localhost:5174/?site=igov`
- `http://localhost:5174/?site=webtv`
- `http://localhost:5174/?site=transcripts`
- `http://localhost:5174/?site=digitallibrary`
- `http://localhost:5174/?site=ods`
- `http://localhost:5174/?site=bluebook`

The site is English only. `?site=` overrides only work on loopback hosts.
Unknown hosts, including Vercel preview URLs, show a generic UN Daily headline
and the same animation. Paths and query parameters never alter the destination.

## Behaviour

Each recognised host shows its product headline, the exact independent-project
disclaimer, an unframed full-page animation and “7 mandates. 1 integrated website.”
The seven product names revolve vertically, converge, and give way to UN Daily.
There are no controls, language picker, countdown, source overview or footer.

One eight-second CSS timeline drives the rotation, merge, reveal and final hold.
Its root `animationend` event navigates to **https://daily.unfck.org/about**.
There is no independent JavaScript redirect timer. Reduced-motion preferences
show the final UN Daily frame without movement, hold it for 1.5 seconds on the
same completion mechanism, then redirect. Generic preview hosts also redirect.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Tests cover all seven exact host mappings and hostile lookalikes, loopback-only
previews, English-only output with the exact disclaimer and headline, absence of
controls, the fixed about destination, and navigation only from the root animation
completion event. Visual timing and choreography require browser inspection.

## Vercel setup

Create a Vercel project using Vite, with `npm run build` and output directory
`dist`. Attach these domains **to this project**, without configuring Vercel
redirects to Daily (the explanatory page must render first):

```text
journal.unfck.org
igov.unfck.org
webtv.unfck.org
transcripts.unfck.org
digitallibrary.unfck.org
ods.unfck.org
bluebook.unfck.org
```

Use the CNAME target Vercel supplies for each domain in Namecheap. All seven hosts
serve the same static app; it reads the hostname locally. Daily itself belongs to
a separate project. No environment variables are required. `vercel.json` supplies
SPA fallback and no-index response headers. HTML metadata and `robots.txt` also
exclude indexing. No deployment or remote repository is created by this setup.

## Future links to specific pages — proposals only

No source-path resolver is implemented. The safe fallback remains the Daily about page.
Only add mappings after Daily exposes a stable destination route and unmatched
identifiers have an explicit fallback.

| Source | Possible mapping | Requirement / limitation |
| --- | --- | --- |
| Web TV / Transcripts | Preserve Web TV asset path through the transcripts app's existing resolver, then link to the Daily meeting | Reuse that resolver; confirm Daily accepts the same asset identifier. Do not guess Daily meeting IDs from asset IDs. |
| Journal | Journal meeting ID → Daily meeting | Need a stable lookup from the upstream ID to Daily's canonical meeting ID. |
| iGov | Meeting/document ID → Daily detail | Separate namespaces; validate kinds and publish lookup endpoints. |
| Digital Library | Record ID → Daily document | Join bibliographic records to Daily documents; use symbol plus language/version, with ambiguous matches rejected. |
| ODS | Symbol parameter/path → Daily document text | Normalize symbol syntax carefully; preserve revision/addendum/corrigendum distinctions. |
| Blue Book | Mission/country identifier → Daily delegation | An explicit authoritative country-code map is cheaper and safer than fuzzy names. |

For any future resolver, keep targets allowlisted to Daily, test every supported
URL grammar and both missing/ambiguous IDs, and retain a visible explanation.
