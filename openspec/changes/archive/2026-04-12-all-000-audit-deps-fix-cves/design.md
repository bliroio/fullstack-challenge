## Context

The project has two npm workspaces — `server/` (Express + Mongoose) and `client/` (Next.js 15). A routine `npm audit` reveals 11 known CVEs across both, two of which are CRITICAL (CVSS 10.0 and 9.0). The most severe is CVE-2025-66478 in Next.js 15.4.4, which allows unauthenticated RCE via a crafted HTTP request to the RSC protocol endpoint. Mongoose carries CVE-2025-23061 (CVSS 9.0), a query-injection bypass via `populate()` match filters.

All vulnerable packages fall within semver ranges that allow a safe non-breaking patch via `npm audit fix` — no major version bumps are required.

## Goals / Non-Goals

**Goals:**

- Eliminate all HIGH and CRITICAL CVEs in both `server/` and `client/` dependency trees
- Confirm server TypeScript build remains error-free after patching
- Confirm mongoose resolves to ≥8.9.5 (required for CVE-2025-23061 fix)
- Keep `package.json` files untouched — only `package-lock.json` is updated

**Non-Goals:**

- Fixing the pre-existing `layout.tsx` build error in the client (tracked in FE-000)
- Patching MODERATE or LOW severity CVEs beyond what `npm audit fix` handles automatically
- Updating packages not flagged by audit
- Runtime/integration testing (deferred — requires MongoDB)

## Decisions

### Decision: Use `npm audit fix` (not `--force`, not manual edits)

`npm audit fix` resolves only the minimum set of packages needed to satisfy the advisory, respecting the existing semver ranges in `package.json`. This is the safest automated approach.

Alternatives considered:

- `npm audit fix --force`: Can bump major versions and introduce breaking API changes. Rejected.
- Manual `package.json` edits: Error-prone and bypasses npm's resolution algorithm. Rejected.
- `npm update`: Updates all packages to latest within semver range, not just vulnerable ones — unnecessary churn. Rejected.

### Decision: Verify mongoose version explicitly after audit fix

The `package.json` declares `mongoose: "^8.0.1"`. While the semver range allows 8.9.5+, npm may resolve to an older cached version. An explicit `node -e "require('mongoose/package.json').version"` check after fix confirms the patched version was actually installed. If not, `npm install mongoose@^8.9.5` forces the update.

### Decision: Accept client build failure as pre-existing

The client `npm run build` is known to fail due to a JSX type error in `layout.tsx`. The audit fix does not introduce or worsen this failure — it is orthogonal.

## Risks / Trade-offs

- **[Risk] next 15.4→15.5 introduces subtle behavioral changes** → Mitigation: The app uses no dynamic routes, no RSC, no middleware, no rewrites — none of the features touched by 15.5 changes. Risk is very low.
- **[Risk] express 4.18→4.22 changes default behavior** → Mitigation: Express 4.x is semver-stable; 4.18→4.22 is a patch/minor update with backward-compatible changes only.
- **[Risk] npm resolves mongoose to a version below 8.9.5** → Mitigation: Explicit version check with fallback install step in tasks.
