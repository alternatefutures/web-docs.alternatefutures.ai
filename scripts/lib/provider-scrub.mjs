/**
 * House rule: the docs describe capabilities, never the underlying compute
 * vendors. Generated pages take their text from source repos that do name
 * them, so every generator passes its output through here.
 *
 *  - scrubProviders(text)   rewrites vendor names in prose to the tier they
 *    stand for; a sentence that still carries a vendor name inside an
 *    identifier (a filename, an image tag) is dropped whole.
 *  - stripProviderAsides()  removes "(… vendor …)" parentheticals from short
 *    labels and headings, where a tier phrase would read badly.
 *  - isProviderTerm(name)   says whether an identifier (type, field, enum
 *    value, tag, image) carries a vendor name; callers drop those.
 *  - assertNoProviders()    final guard: throws with the offending lines so a
 *    new leak fails the build instead of shipping.
 */

const PROVIDER_WORD = /akash|phala|spheron/i;

const TIER = {
  akash: 'the standard compute tier',
  phala: 'the confidential compute (TEE) tier',
  spheron: 'the GPU compute tier',
};

// Whole-word vendor mentions in any casing, with their usual suffixes.
const WORD_RE = /\b(akash|phala|spheron)(?:\s+(?:network|cloud))?\b/gi;

export function isProviderTerm(name) {
  return PROVIDER_WORD.test(String(name ?? ''));
}

export function stripProviderAsides(text) {
  return String(text ?? '')
    .replace(/\s*\([^()]*\)/g, (m) => (PROVIDER_WORD.test(m) ? '' : m))
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function scrubProviders(text) {
  let out = String(text ?? '').replace(WORD_RE, (_, name) => TIER[name.toLowerCase()]);
  // Sentence starts: "the standard…" → "The standard…"
  out = out.replace(/(^|[.!?]\s+|\n\s*)the (standard compute|confidential compute|GPU compute)/g, '$1The $2');
  if (!PROVIDER_WORD.test(out)) return out;
  // A vendor name inside an identifier (AF_IMPLEMENTATION_X.md, image-x:v2):
  // drop the sentence, the reader loses an internal cross-reference at most.
  return out
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !PROVIDER_WORD.test(sentence))
    .join(' ')
    .trim();
}

/**
 * House style for copy lifted from source repos: no em-dashes (an aside
 * becomes a colon clause), no doubled spaces.
 */
export function tidyCopy(text) {
  return String(text ?? '')
    .replace(/\s*—\s*/g, ': ')
    .replace(/ {2,}/g, ' ');
}

export function assertNoProviders(text, label) {
  const lines = String(text).split('\n');
  const bad = lines.map((l, i) => [i + 1, l]).filter(([, l]) => PROVIDER_WORD.test(l));
  if (bad.length > 0) {
    const sample = bad.slice(0, 5).map(([n, l]) => `  line ${n}: ${l.trim().slice(0, 140)}`).join('\n');
    throw new Error(`${label}: ${bad.length} line(s) still name a compute vendor. Extend provider-scrub.mjs or drop the item.\n${sample}`);
  }
}
