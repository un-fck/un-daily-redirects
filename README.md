# UNFCK redirects

An independent, unofficial demonstration connecting seven shadow domains to
https://daily.un-two-zero.org/about through an animation of eight services.
No official emblems, analytics, authentication or backend.

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

Each recognised host shows its product headline and an unframed full-page animation.
The current product's official hostname starts alone, then unfolds into an eight-line
list of official hostnames. The services converge into a large
UN Daily wordmark, which holds for 3.5 seconds. Only after the wordmark is fully
revealed does “8 mandates. 1 integrated website.” fade in directly beneath it.
There is no disclaimer in the page or its no-JavaScript fallback.
There are no controls, language picker, countdown, source overview or footer.

One 12.5-second CSS timeline drives the introduction, unfolding, convergence,
reveal and final hold.
Eight rows are centred around their midpoint with a 38–50px responsive gap and
space for one additional row of padding. The existing easing curves and timing
remain unchanged; all eight labels are fully visible before convergence begins.
The wordmark is fully visible at 9 seconds (72%); the slogan fades in from 9 to
9.5 seconds (72–76%). Both remain until navigation at 12.5 seconds.
Its root `animationend` event navigates to **https://daily.un-two-zero.org/about**.
There is no independent JavaScript redirect timer. Reduced-motion preferences
show the final UN Daily frame and slogan without movement, hold it for 3.5 seconds on the
same completion mechanism, then redirect. Generic preview hosts also redirect.
With JavaScript disabled, a `noscript` meta refresh navigates directly to the same
fixed destination without showing controls or a disclaimer.

Animation labels use the official website hostnames; incoming shadow-host routing
is unchanged:

| Source | Animation hostname |
| --- | --- |
| Journal | `journal.un.org` |
| iGov | `igov.un.org` |
| Web TV | `webtv.un.org` |
| Transcripts | `transcripts.un.org` |
| Digital Library | `digitallibrary.un.org` |
| ODS | `documents.un.org` |
| Blue Book | `bluebook.e-delegate.un.org` |
| e-Speakers (display only) | `e-speakers.e-delegate.un.org` |

e-Speakers appears in every animation but has no incoming shadow-host mapping or
`?site=` override. The seven existing host mappings and local previews are unchanged.

iGov's hostname is documented by [DGACM](https://www.un.org/dgacm/en/node/5433).
The [official Blue Book page](https://www.un.org/dgacm/en/content/protocol/blue-book)
links to `https://bluebook.unmeetings.org/`, which redirects to
`https://bluebook.e-delegate.un.org:443/` (verified 1 November 2026). This matches
Daily's existing Blue Book source. The final brand remains UN Daily, without a URL.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Tests cover all seven exact host mappings and hostile lookalikes, loopback-only
previews, English-only output with all eight official hostnames and product headline,
absence of a disclaimer and controls, the slogan beneath UN Daily, the fixed about
destination in runtime and no-JavaScript output, centred eight-row placement,
and runtime navigation only from the root animation completion event. Visual
timing and choreography require browser inspection.

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
