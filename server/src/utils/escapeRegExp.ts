/**
 * Escapes all regex metacharacters in a string so it can be safely used
 * inside `new RegExp()` or MongoDB's `$regex` operator as a literal match.
 *
 * This is the same implementation used by `escape-string-regexp` (112M+
 * weekly downloads) and documented on MDN. We inline it instead of adding
 * a dependency because:
 * - `escape-string-regexp` v5 is ESM-only (our server is CommonJS)
 * - `escape-string-regexp` v4 works but is unmaintained since 2021
 * - The logic is a single `replace()` call — well-understood and stable
 *
 * When the project's minimum Node version is bumped to 24+, this can be
 * replaced with the native `RegExp.escape()` (TC39 Stage 4, ES2025).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
 * @see https://tc39.es/proposal-regex-escaping/
 */
export const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
