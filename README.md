# UNFCK redirects

An independent, unofficial demonstration connecting seven shadow domains to
https://daily.unfck.org. No official emblems, analytics, authentication or backend.

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

Add `&lang=fr` (or `en`, `es`, `ru`, `zh`, `ar`). Language selection prefers the
query, then a language prefix in the path, then browser preferences, then English.
The product override only works on loopback hosts. Unrecognised production hosts
show a generic concept page with manual navigation, so a Vercel preview won't
silently send reviewers away.

## Behaviour

Recognised hosts show the corresponding product headline, a vertical name carousel
merging into UN Daily, and an eight-second countdown. Every redirect goes to the
fixed Daily homepage. Paths and query parameters are deliberately not forwarded.

“Stay here” cancels navigation and pauses animation. Replay cancels navigation and
starts the animation again. Selecting a language cancels navigation. Hiding the
tab cancels navigation; a tab opened in the background starts cancelled. A fixed
“Stay here” control stays in reach on narrow screens during the countdown. Reduced-motion preferences show a static final frame.
The countdown is separate from the animation and still runs with reduced motion;
“Stay here” remains available. The progress indicator is static in reduced motion.
Digital Library and ODS explicitly carry a planned-integration label.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

The unit checks cover all seven host mappings, hostile lookalikes, loopback-only
previews, complete locale keys and product records, language precedence including
inherited-object-property attacks, the exact English disclaimer, and the eight-
second deadline. They do not grade translation quality or visual appearance.

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

No source-path resolver is implemented. The safe fallback remains the Daily home.
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
