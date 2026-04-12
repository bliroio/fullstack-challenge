## 1. Fix Server Dependencies

- [x] 1.1 Run `npm audit fix --cache /tmp/claude/npm-cache` in `server/` to patch express, mongoose, js-yaml, minimatch, and validator
- [x] 1.2 Verify mongoose version is ≥8.9.5 by running `node -e "console.log(require('mongoose/package.json').version)"` in `server/`; if below 8.9.5, run `npm install mongoose@^8.9.5 --cache /tmp/claude/npm-cache`
- [x] 1.3 Verify server TypeScript build succeeds with zero errors: `npm run build` in `server/`

## 2. Fix Client Dependencies

- [x] 2.1 Run `npm audit fix --cache /tmp/claude/npm-cache` in `client/` to patch next (→15.5.x), axios (→1.15.x), and yaml
- [x] 2.2 Verify next version is ≥15.5.0 by running `node -e "console.log(require('next/package.json').version)"` in `client/`

## 3. Verify Audit Clean

- [x] 3.1 Run `npm audit --cache /tmp/claude/npm-cache` in `server/` and confirm 0 HIGH and 0 CRITICAL vulnerabilities
- [x] 3.2 Run `npm audit --cache /tmp/claude/npm-cache` in `client/` and confirm 0 HIGH and 0 CRITICAL vulnerabilities

## 4. Confirm Source Files Unchanged

- [x] 4.1 Run `git diff --name-only` and confirm no files under `server/src/` or `client/app/` are listed
